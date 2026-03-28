"use client";

import SearchIcon from "@/components/icons/SearchIcon";

interface SuiviSearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onShowAllOrders: () => void;
  isLoading?: boolean;
}

export default function SuiviSearchForm({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  onShowAllOrders,
  isLoading = false,
}: SuiviSearchFormProps) {
  return (
    <div className="bg-white rounded-3xl p-4 border border-gray-200 mb-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="order-search" className="block text-sm font-semibold mb-2">
            Numéro de commande
          </label>
          <div className="relative">
            <input
              id="order-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Ex: CMD-2024-001"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              disabled={isLoading}
            />
            <SearchIcon
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? "Recherche..." : "Suivre ma commande"}
          </button>
          <button
            type="button"
            onClick={onShowAllOrders}
            disabled={isLoading}
            className="flex-1 bg-white text-gray-900 py-3 px-6 rounded-full font-semibold border-2 border-gray-900 hover:bg-gray-50 disabled:opacity-60 transition-all cursor-pointer"
          >
            Voir toutes mes commandes
          </button>
        </div>
      </form>
    </div>
  );
}
