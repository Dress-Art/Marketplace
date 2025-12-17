// API Service for marketplace-models-list endpoint
// Uses Next.js API route proxy to avoid CORS issues

import { ModelsListParams, ModelsListResponse } from '@/lib/types/models.types';

/**
 * Fetches a paginated and filterable list of models from the marketplace
 * Uses Next.js API route as proxy to avoid CORS issues
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with models data and pagination metadata
 */
export async function fetchModels(
    params: ModelsListParams = {}
): Promise<ModelsListResponse> {
    try {
        // Call Next.js API route (server-side proxy)
        const response = await fetch('/api/models', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch models' }));
            throw new Error(errorData.error || 'Failed to fetch models');
        }

        const data = await response.json();
        return data as ModelsListResponse;
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
 * Fetches models filtered by category
 * @param categorie - Category to filter by
 * @returns Promise with filtered models
 */
export async function fetchModelsByCategory(categorie: string): Promise<ModelsListResponse> {
    return fetchModels({ categorie, page: 1, per_page: 20 });
}
