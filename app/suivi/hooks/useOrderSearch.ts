"use client";

import { useState, useCallback } from "react";
import { fetchOrderByNumber } from "@/lib/api/orders.api";
import type { SuiviOrder } from "@/lib/types/suivi.types";

interface UseOrderSearchReturn {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedOrder: SuiviOrder | null;
  setSelectedOrder: (order: SuiviOrder | null) => void;
  showAllOrders: boolean;
  setShowAllOrders: (value: boolean) => void;
  isLoading: boolean;
  error: string | null;
  searchByOrderNumber: (
    orderNumber: string,
    mockFallback?: SuiviOrder[]
  ) => Promise<void>;
}

export const useOrderSearch = (): UseOrderSearchReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<SuiviOrder | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByOrderNumber = useCallback(
    async (orderNumber: string, mockFallback?: SuiviOrder[]) => {
      const normalized = orderNumber.trim().toUpperCase();
      if (!normalized) return;

      setIsLoading(true);
      setError(null);

      try {
        const order = await fetchOrderByNumber(normalized);
        if (order) {
          setSelectedOrder(order);
          setShowAllOrders(false);
          return;
        }

        const mockOrder = mockFallback?.find(
          (o) => o.orderNumber.toUpperCase() === normalized
        );
        if (mockOrder) {
          setSelectedOrder(mockOrder);
          setShowAllOrders(false);
        } else {
          setError("Commande non trouvée. Vérifiez votre numéro de commande.");
          setSelectedOrder(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Une erreur est survenue. Réessayez.";
        setError(message);
        setSelectedOrder(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedOrder,
    setSelectedOrder,
    showAllOrders,
    setShowAllOrders,
    isLoading,
    error,
    searchByOrderNumber,
  };
};
