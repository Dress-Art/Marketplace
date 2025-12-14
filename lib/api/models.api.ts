// API Service for marketplace-models-list endpoint
import { ModelsListParams, ModelsListResponse, ApiError } from '@/lib/types/api.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Fetches a paginated and filterable list of models from the marketplace
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with models data and pagination metadata
 */
export async function fetchModels(
    params: ModelsListParams = {}
): Promise<ModelsListResponse> {
    try {
        // Build query string from params
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params.q) queryParams.append('q', params.q);
        if (params.min_price) queryParams.append('min_price', params.min_price.toString());
        if (params.max_price) queryParams.append('max_price', params.max_price.toString());
        if (params.in_stock !== undefined) queryParams.append('in_stock', params.in_stock.toString());
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.order) queryParams.append('order', params.order);

        // Handle multiple tags
        if (params.tag) {
            const tags = Array.isArray(params.tag) ? params.tag : [params.tag];
            tags.forEach(tag => queryParams.append('tag', tag));
        }

        const url = `${SUPABASE_URL}/functions/v1/marketplace-models-list?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });

        if (!response.ok) {
            const errorData: ApiError = await response.json().catch(() => ({
                error: 'Failed to fetch models',
                message: response.statusText,
            }));
            throw new Error(errorData.message || errorData.error);
        }

        const data: ModelsListResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
}

/**
 * Fetches a single page of models with default parameters
 * @returns Promise with first page of models
 */
export async function fetchModelsFirstPage(): Promise<ModelsListResponse> {
    return fetchModels({ page: 1, per_page: 20 });
}

/**
 * Search models by name
 * @param query - Search query string
 * @returns Promise with matching models
 */
export async function searchModels(query: string): Promise<ModelsListResponse> {
    return fetchModels({ q: query, page: 1, per_page: 20 });
}

/**
 * Fetches models filtered by tag
 * @param tag - Tag to filter by
 * @returns Promise with filtered models
 */
export async function fetchModelsByTag(tag: string): Promise<ModelsListResponse> {
    return fetchModels({ tag, page: 1, per_page: 20 });
}

/**
 * Fetches in-stock models only
 * @returns Promise with in-stock models
 */
export async function fetchInStockModels(): Promise<ModelsListResponse> {
    return fetchModels({ in_stock: true, page: 1, per_page: 20 });
}
