export interface Category {
    id_categ: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id_prod: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    category_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image_url?: string;
    category_id?: string;
}

export interface UpdateProductRequest {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image_url?: string;
    category_id?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
