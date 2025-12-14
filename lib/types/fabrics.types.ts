// API Types for marketplace-fabrics-list endpoint

export interface Fabric {
    id: string;
    name: string;
    texture: string | null;
    price_per_meter: number;
    images: string[];
    colors: string[];
    stock: number;
    vendor_id: string;
    created_at: string;
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
