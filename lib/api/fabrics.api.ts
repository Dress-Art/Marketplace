// API Service for marketplace-fabrics-list endpoint
// Uses Next.js API route proxy to avoid CORS issues

import { FabricsListParams, FabricsListResponse } from '@/lib/types/fabrics.types';

/**
 * Fetches a paginated and filterable list of fabrics from the marketplace
 * Uses Next.js API route as proxy to avoid CORS issues
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with fabrics data and pagination metadata
 */
export async function fetchFabrics(
    params: FabricsListParams = {}
): Promise<FabricsListResponse> {
    try {
        // Call Next.js API route (server-side proxy)
        const response = await fetch('/api/fabrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch fabrics' }));
            throw new Error(errorData.error || 'Failed to fetch fabrics');
        }

        const data = await response.json();
        return data as FabricsListResponse;
    } catch (error) {
        console.error('Error fetching fabrics:', error);
        throw error;
    }
}

/**
 * Fetches a single page of fabrics with default parameters
 * @returns Promise with first page of fabrics
 */
export async function fetchFabricsFirstPage(): Promise<FabricsListResponse> {
    return fetchFabrics({ page: 1, per_page: 20 });
}

/**
 * Search fabrics by name
 * @param query - Search query string
 * @returns Promise with matching fabrics
 */
export async function searchFabrics(query: string): Promise<FabricsListResponse> {
    return fetchFabrics({ q: query, page: 1, per_page: 20 });
}

/**
 * Fetches fabrics filtered by color
 * @param color - Color to filter by
 * @returns Promise with filtered fabrics
 */
export async function fetchFabricsByColor(color: string): Promise<FabricsListResponse> {
    return fetchFabrics({ color, page: 1, per_page: 20 });
}

/**
 * Fetches fabrics filtered by texture
 * @param texture - Texture to filter by
 * @returns Promise with filtered fabrics
 */
export async function fetchFabricsByTexture(texture: string): Promise<FabricsListResponse> {
    return fetchFabrics({ texture, page: 1, per_page: 20 });
}

/**
 * Fetches in-stock fabrics only
 * @returns Promise with in-stock fabrics
 */
export async function fetchInStockFabrics(): Promise<FabricsListResponse> {
    return fetchFabrics({ in_stock: true, page: 1, per_page: 20 });
}
