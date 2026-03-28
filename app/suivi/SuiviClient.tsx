"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/models/Header";
import SuiviSearchForm from "./components/SuiviSearchForm";
import OrderDetailCard from "./components/OrderDetailCard";
import OrderListCard from "./components/OrderListCard";
import SuiviInfoSection from "./components/SuiviInfoSection";
import SuiviEmptyState from "./components/SuiviEmptyState";
import { useOrderSearch } from "./hooks/useOrderSearch";
import { ordersData } from "@/lib/constants/suivi-orders";
import type { SuiviOrder } from "@/lib/types/suivi.types";

export default function SuiviClient() {
  const searchParams = useSearchParams();

  const {
    searchQuery,
    setSearchQuery,
    selectedOrder,
    setSelectedOrder,
    showAllOrders,
    setShowAllOrders,
    isLoading,
    error,
    searchByOrderNumber,
  } = useOrderSearch();

  // Auto-search if ?q= param is present (e.g. coming from payment success page)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
      searchByOrderNumber(q, ordersData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByOrderNumber(searchQuery, ordersData);
  };

  const handleShowAllOrders = () => {
    setShowAllOrders(true);
    setSelectedOrder(null);
  };

  const handleOrderSelect = (order: SuiviOrder) => {
    setSelectedOrder(order);
    setShowAllOrders(false);
  };

  const handleTestOrderClick = (orderNumber: string, order: SuiviOrder) => {
    setSearchQuery(orderNumber);
    setSelectedOrder(order);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <main className="min-h-screen pt-16">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Suivi de commande</h1>
            <p className="text-gray-600">
              Entrez votre numéro de commande ou consultez votre historique
            </p>
          </div>

          <SuiviSearchForm
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSubmit={handleSearch}
            onShowAllOrders={handleShowAllOrders}
            isLoading={isLoading}
          />

          {error && (
            <SuiviEmptyState message={error} className="mb-8" />
          )}

          {selectedOrder && !showAllOrders && (
            <OrderDetailCard order={selectedOrder} />
          )}

          {showAllOrders && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Historique des commandes
              </h2>
              {ordersData.map((order) => (
                <OrderListCard
                  key={order.id}
                  order={order}
                  onClick={() => handleOrderSelect(order)}
                />
              ))}
            </div>
          )}

          {!selectedOrder && !showAllOrders && (
            <SuiviInfoSection
              testOrders={ordersData}
              onOrderNumberClick={handleTestOrderClick}
            />
          )}
        </div>
      </main>
    </div>
  );
}
