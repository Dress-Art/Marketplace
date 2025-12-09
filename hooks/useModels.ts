'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchModels, Model, ModelsFilters } from '@/lib/api/models';
import { modelsData } from '@/app/models/data';

interface UseModelsResult {
    models: Model[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    totalCount: number;
    loadMore: () => void;
    isUsingAPI: boolean;
}

/**
 * Hook pour gérer la récupération des modèles avec API ou fallback local
 */
export function useModels(filters: ModelsFilters = {}): UseModelsResult {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isUsingAPI, setIsUsingAPI] = useState(true);

    const loadData = useCallback(async (currentPage: number, append: boolean = false) => {
        setLoading(true);
        setError(null);

        try {
            // Tentative avec l'API
            const response = await fetchModels({
                ...filters,
                page: currentPage,
                limit: filters.limit || 8,
            });

            if (append) {
                setModels(prev => [...prev, ...response.models]);
            } else {
                setModels(response.models);
            }

            setTotalPages(response.totalPages);
            setTotalCount(response.total);
            setPage(currentPage);
            setIsUsingAPI(true);
        } catch (err) {
            console.warn('⚠️ API indisponible, utilisation des données locales');
            
            // Fallback sur données locales
            const filteredLocal = modelsData.filter(model => {
                if (filters.type && model.type !== filters.type) return false;
                if (filters.designer && model.designer !== filters.designer) return false;
                if (filters.priceMin && model.prix < filters.priceMin) return false;
                if (filters.priceMax && model.prix > filters.priceMax) return false;
                return true;
            });

            const limit = filters.limit || 8;
            const start = (currentPage - 1) * limit;
            const paginatedLocal = filteredLocal.slice(start, start + limit);

            if (append) {
                setModels(prev => [...prev, ...paginatedLocal]);
            } else {
                setModels(paginatedLocal);
            }

            setTotalCount(filteredLocal.length);
            setTotalPages(Math.ceil(filteredLocal.length / limit));
            setPage(currentPage);
            setIsUsingAPI(false);
            setError(err instanceof Error ? err.message : 'Erreur API');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Charger les données au montage et quand les filtres changent
    useEffect(() => {
        setPage(1);
        loadData(1, false);
    }, [loadData]);

    const loadMore = useCallback(() => {
        if (page < totalPages && !loading) {
            loadData(page + 1, true);
        }
    }, [page, totalPages, loading, loadData]);

    const hasMore = page < totalPages;

    return {
        models,
        loading,
        error,
        hasMore,
        totalCount,
        loadMore,
        isUsingAPI,
    };
}
