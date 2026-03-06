import { Suspense } from "react";
import Header from "@/components/models/Header";
import PaymentGuard from "./PaymentGuard";

export const metadata = {
  title: "Paiement Réussi | DressArt",
  description: "Votre paiement a été effectué avec succès",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense
        fallback={
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement…</p>
            </div>
          </div>
        }
      >
        <PaymentGuard />
      </Suspense>
    </div>
  );
}
