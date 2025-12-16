// React Hook for fetching models
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchModels } from '@/lib/api/models.api';
import { Model, ModelsListParams, PaginationMeta } from '@/lib/types/models.types';

interface UseModelsResult {
    models: Model[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: ModelsListParams) => Promise<void>;
}

/**
 * Custom hook for fetching and managing marketplace models
 * @param initialParams - Initial query parameters
 * @returns Object containing models data, loading state, error, and refetch function
 */
export function useModels(initialParams: ModelsListParams = {}): UseModelsResult {
    const [models, setModels] = useState<Model[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<ModelsListParams>(initialParams);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchModels(params);
            setModels(response.data);
            setMeta(response.meta);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch models';
            setError(errorMessage);
            console.error('Error in useModels:', err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(async (newParams?: ModelsListParams) => {
        if (newParams) {
            setParams({ ...params, ...newParams });
        } else {
            await fetchData();
        }
    }, [params, fetchData]);

    return {
        models,
        meta,
        loading,
        error,
        refetch,
    };
}

/**
 * Hook for searching models with debounced search
 * @param searchQuery - Search query string
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Object containing search results, loading state, and error
 */
export function useModelSearch(searchQuery: string, debounceMs: number = 300): UseModelsResult {
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, debounceMs]);

    return useModels({ q: debouncedQuery, page: 1, per_page: 20 });
}
