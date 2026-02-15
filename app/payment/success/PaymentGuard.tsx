"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentGuard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState<boolean | null>(null);
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
          setApproved(null);
          setStatus("unknown");
          setError("Impossible de vérifier le paiement (identifiant manquant).");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/payment/verify?transactionId=${encodeURIComponent(txId)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          setApproved(null);
          setStatus("unknown");
          setError(data?.error || "Vérification indisponible");
        } else {
          setApproved(!!data.approved);
          setStatus(data.status || null);
          if (data.approved) {
            try {
              localStorage.removeItem("pendingPayment");
            } catch {}
          }
        }
      } catch {
        setApproved(null);
        setStatus("unknown");
        setError("Erreur lors de la vérification");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [searchParams]);

  if (loading) {
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

  if (approved === true) return null;

  if (approved === false) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement non confirmé</h1>
          <p className="text-gray-600 mb-8">Statut: {status || "inconnu"}</p>
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement en attente</h1>
        <p className="text-gray-600 mb-8">
          {error || "Nous n’avons pas pu confirmer le paiement pour le moment."}
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
