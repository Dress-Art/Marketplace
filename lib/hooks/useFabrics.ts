// React Hook for fetching fabrics
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchFabrics } from '@/lib/api/fabrics.api';
import { Fabric, FabricsListParams, PaginationMeta } from '@/lib/types/fabrics.types';

interface UseFabricsResult {
    fabrics: Fabric[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: FabricsListParams) => Promise<void>;
}

/**
 * Custom hook for fetching and managing marketplace fabrics
 * @param initialParams - Initial query parameters
 * @returns Object containing fabrics data, loading state, error, and refetch function
 */
export function useFabrics(initialParams: FabricsListParams = {}): UseFabricsResult {
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<FabricsListParams>(initialParams);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFabrics(params);
            setFabrics(response.data);
            setMeta(response.meta);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fabrics';
            setError(errorMessage);
            console.error('Error in useFabrics:', err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(async (newParams?: FabricsListParams) => {
        if (newParams) {
            setParams({ ...params, ...newParams });
        } else {
            await fetchData();
        }
    }, [params, fetchData]);

    return {
        fabrics,
        meta,
        loading,
        error,
        refetch,
    };
}

/**
 * Hook for searching fabrics with debounced search
 * @param searchQuery - Search query string
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Object containing search results, loading state, and error
 */
export function useFabricSearch(searchQuery: string, debounceMs: number = 300): UseFabricsResult {
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, debounceMs]);

    return useFabrics({ q: debouncedQuery, page: 1, per_page: 20 });
}
