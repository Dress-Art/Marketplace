// API Types for marketplace-models-list endpoint

export interface Model {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    tags: string[];
    stock: number;
    vendor_id: string;
    created_at: string;
}

export interface ModelsListParams {
    page?: number;
    per_page?: number;
    q?: string;
    tag?: string | string[];
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginationMeta {
    page: number;
    per_page: number;
    total: number;
}

export interface ModelsListResponse {
    data: Model[];
    meta: PaginationMeta;
}

export interface ApiError {
    error: string;
    message?: string;
    code?: string;
}
