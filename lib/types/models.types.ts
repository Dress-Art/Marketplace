// API Types for marketplace-models-list endpoint

export interface Model {
    id: string;
    nom: string;
    description: string;
    image_url: string;
    prix_base: number;
    categorie: string;
    professional_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface ModelsListParams {
    page?: number;
    per_page?: number;
    q?: string;
    categorie?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface ModelsListResponse {
    data: Model[];
    meta: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    per_page: number;
    total: number;
}

export interface ApiError {
    error: string;
    message?: string;
    code?: string;
}
