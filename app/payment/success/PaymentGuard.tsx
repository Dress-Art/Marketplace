"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type VerifyState = "loading" | "approved" | "rejected" | "unknown";

export default function PaymentGuard() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyState>("loading");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        let txId =
          searchParams.get("transactionId") ||
          searchParams.get("id") ||
          searchParams.get("transaction_id") ||
          searchParams.get("reference");

        if (!txId) {
          try {
            const pending = localStorage.getItem("pendingPayment");
            if (pending) {
              const parsed = JSON.parse(pending);
              txId = parsed?.sessionId;
            }
          } catch {}
        }

        if (!txId) {
          setState("unknown");
          setError("Impossible de vérifier le paiement (identifiant manquant).");
          return;
        }

        const res = await fetch(`/api/payment/verify?transactionId=${encodeURIComponent(txId)}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          setState("unknown");
          setError(data?.error || "Vérification indisponible");
          return;
        }

        if (data.approved) {
          setState("approved");
          setOrderNumber(data.orderNumber ?? null);
          try {
            localStorage.removeItem("pendingPayment");
            if (data.orderNumber) {
              localStorage.setItem("lastOrderNumber", data.orderNumber);
            }
          } catch {}
        } else {
          setState("rejected");
          setStatus(data.status ?? null);
        }
      } catch {
        setState("unknown");
        setError("Erreur lors de la vérification");
      }
    };

    verify();
  }, [searchParams]);

  if (state === "loading") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Vérification du paiement…</h1>
          <p className="text-gray-600">Merci de patienter.</p>
        </div>
      </div>
    );
  }

  if (state === "rejected") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement non confirmé</h1>
          <p className="text-gray-600 mb-8">Statut : {status || "inconnu"}</p>
          <Link
            href="/models"
            className="inline-block bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all"
          >
            Réessayer
          </Link>
        </div>
      </div>
    );
  }

  if (state === "unknown") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement en attente</h1>
          <p className="text-gray-600 mb-8">
            {error || "Nous n'avons pas pu confirmer le paiement pour le moment."}
          </p>
          <Link
            href="/models"
            className="inline-block bg-white text-gray-900 py-3 px-6 rounded-full font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-all"
          >
            Retour aux modèles
          </Link>
        </div>
      </div>
    );
  }

  // approved — render the full success UI
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
          <p className="text-gray-600 mb-6">
            Votre commande a été confirmée avec succès.
          </p>

          {/* Order number */}
          {orderNumber ? (
            <div className="bg-gray-900 text-white rounded-2xl p-5 mb-6">
              <p className="text-sm text-gray-300 mb-1">Votre numéro de commande</p>
              <p className="text-2xl font-bold tracking-widest">{orderNumber}</p>
              <p className="text-xs text-gray-400 mt-2">
                Conservez ce numéro pour suivre votre commande
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                Votre numéro de commande vous sera envoyé par SMS dans quelques instants.
              </p>
            </div>
          )}

          {/* Next steps */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-2">Prochaines étapes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Vous recevrez un SMS de confirmation</li>
              <li>✓ Vous pourrez suivre votre commande en temps réel</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={orderNumber ? `/suivi?q=${encodeURIComponent(orderNumber)}` : "/suivi"}
              className="block w-full bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all"
            >
              Suivre ma commande
            </Link>
            <Link
              href="/models"
              className="block w-full bg-white text-gray-900 py-3 px-6 rounded-full font-semibold border-2 border-gray-900 hover:bg-gray-50 transition-all"
            >
              Retour aux modèles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
