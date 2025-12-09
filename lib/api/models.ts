import { supabase } from '../supabase';

export interface Model {
    id: number;
    image: string;
    titre: string;
    description: string;
    prix: number;
    type: string;
    designer: string;
    width: number;
    height: number;
}

export interface ModelsFilters {
    type?: string;
    designer?: string;
    priceMin?: number;
    priceMax?: number;
    page?: number;
    limit?: number;
}

export interface ModelsResponse {
    models: Model[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Récupère les modèles depuis l'API Supabase
 */
export async function fetchModels(filters: ModelsFilters = {}): Promise<ModelsResponse> {
    try {
        const payload = {
            type: filters.type || null,
            designer: filters.designer || null,
            price_min: filters.priceMin || null,
            price_max: filters.priceMax || null,
            page: filters.page || 1,
            limit: filters.limit || 8,
        };

        const { data, error } = await supabase.functions.invoke('marketplace-models-list', {
            body: payload,
        });

        if (error) {
            console.error('❌ Erreur API:', error);
            throw new Error(error.message);
        }

        return data as ModelsResponse;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des modèles:', error);
        throw error;
    }
}

/**
 * Récupère les types de modèles disponibles
 */
export async function fetchModelTypes(): Promise<string[]> {
    try {
        const { data, error } = await supabase.functions.invoke('marketplace-models-list', {
            body: { get_types: true },
        });

        if (error) throw new Error(error.message);
        return data?.types || [];
    } catch (error) {
        console.error('❌ Erreur types:', error);
        return [];
    }
}

/**
 * Récupère les designers disponibles
 */
export async function fetchDesigners(): Promise<string[]> {
    try {
        const { data, error } = await supabase.functions.invoke('marketplace-models-list', {
            body: { get_designers: true },
        });

        if (error) throw new Error(error.message);
        return data?.designers || [];
    } catch (error) {
        console.error('❌ Erreur designers:', error);
        return [];
    }
}
