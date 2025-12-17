// API Types for marketplace-fabrics-list endpoint

export interface Fabric {
    id: string;
    nom: string;
    texture: string | null;
    couleur: string;
    image_url: string;
    prix_metre: number;
    stock_disponible: boolean;
    created_at: string;
    updated_at: string;
}

export interface FabricsListParams {
    page?: number;
    per_page?: number;
    q?: string;
    color?: string | string[];
    texture?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface FabricsListResponse {
    data: Fabric[];
    meta: PaginationMeta;
}

// Re-export PaginationMeta if not already exported
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
