import { FedaPay, Transaction } from "fedapay";
import crypto from "crypto"; // Import crypto explicitement
import type { CreatePaymentSessionParams, PaymentSessionResponse } from "@/lib/types/payment.types";

// Initialize FedaPay
let fedapayInitialized = false;

function initializeFedaPay() {
  if (fedapayInitialized) return;

  const apiKey = process.env.FEDAPAY_API_KEY;
  const environment = process.env.FEDAPAY_ENVIRONMENT || "live";

  if (apiKey) {
    FedaPay.setApiKey(apiKey);
    FedaPay.setEnvironment(environment);
    fedapayInitialized = true;
  }
}

export class PaymentService {
  /**
   * Create a payment session with FedaPay
   */
  static async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResponse> {
    try {
      const rawAmount =
        params.paymentType === "partial"
          ? params.amount * 0.3 // 30% deposit
          : params.amount;

      const finalAmount = Math.ceil(rawAmount);

      // Check configuration
      const apiKey = process.env.FEDAPAY_API_KEY;

      if (!apiKey) {
        console.warn("FedaPay not configured - Dev Mode");
        return {
          sessionId: `dev_${Date.now()}`,
          paymentUrl: `/payment/success?dev=true&amount=${finalAmount}`,
          paymentToken: '',
          amount: finalAmount,
        };
      }

      initializeFedaPay();

      const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
        /\/$/,
        ""
      );
      const callbackUrl = process.env.FEDAPAY_CALLBACK_URL || `${siteBase}/payment/success`;

      // Gestion du nom (Fallback plus robuste)
      const fullName = params.customerInfo.name.trim();
      const spaceIndex = fullName.indexOf(" ");
      const firstname = spaceIndex > -1 ? fullName.substring(0, spaceIndex) : fullName;
      const lastname = spaceIndex > -1 ? fullName.substring(spaceIndex + 1) : "Client";

      // Create FedaPay transaction
      const transaction = await Transaction.create({
        description: `Commande DressArt - ${params.paymentType === "partial" ? "Acompte 30%" : "Paiement complet"}`,
        amount: finalAmount,
        currency: { iso: "XOF" },
        callback_url: callbackUrl,
        custom_metadata: {
          modelId: params.orderDetails.modelId || "",
          paymentType: params.paymentType,
          appointmentDate: params.orderDetails.appointmentDate
            ? new Date(params.orderDetails.appointmentDate).toISOString()
            : "",
        },
        customer: {
          firstname: firstname,
          lastname: lastname,
          email: params.customerInfo.email || undefined, // Laisser undefined si vide, FedaPay gère ça si le tel est présent
          phone_number: {
            number: params.customerInfo.phone,
            country: "bj", // S'assurer que le numéro n'a pas déjà l'indicatif +229 si on force 'bj'
          },
        },
      });

      // Generate payment token
      const token = await transaction.generateToken();

      // Extraction sécurisée de l'URL et du token
      const paymentUrl = token.url as string;
      const paymentToken = token.token as string;

      if (!paymentUrl || !paymentToken) {
        throw new Error("FedaPay token generation failed: URL or token missing");
      }

      return {
        sessionId: String(transaction.id),
        paymentUrl: paymentUrl,
        paymentToken: paymentToken,
        amount: finalAmount,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ FedaPay Session Error:", message, error);
      throw new Error(`Impossible de créer la session de paiement: ${message}`);
    }
  }

  /**
   * Verify webhook signature from FedaPay
   * CORRECTION 3: Comparaison sécurisée (Timing Safe)
   */
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const secret = process.env.FEDAPAY_WEBHOOK_SECRET;

      if (!secret) {
        console.warn("FEDAPAY_WEBHOOK_SECRET missing");
        return false;
      }

      const hmac = crypto.createHmac("sha256", secret);
      const expectedSignature = hmac.update(payload).digest("hex");

      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      // Évite les timing attacks en comparant à temps constant
      return (
        signatureBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      );
    } catch (error) {
      console.error("Webhook verification error:", error);
      return false;
    }
  }

  /**
   * Get transaction status
   */
  static async getTransactionStatus(transactionId: string) {
    try {
      if (!process.env.FEDAPAY_API_KEY) return null;
      initializeFedaPay();

      // Note: transactionId doit être un ID FedaPay valide (souvent un entier ID ou string ID)
      const transaction = await Transaction.retrieve(transactionId);
      return transaction;
    } catch (error) {
      console.error("Fetch transaction error:", error);
      // Ne pas throw ici permet au front-end de gérer le "null" plus doucement
      return null;
    }
  }
}
