import type { Response } from "..";

// Search
export interface ProductSearch extends Response {
    data: ProductSearchData;
}

export interface ProductSearchData {
    products: ProductSearchDetail[];
    count: number;
}

export interface ProductSearchDetail {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    images: string;
    tags: string;
    price: number;
    stock: string;
    createdAt: string;
    updatedAt: string;
}

// Detail
export interface ProductDetail extends Response {
    data: ProductDetailData;
}

export interface ProductDetailData {
    title: string;
    subtitle: string;
    description: string;
    images: string;
    tags: string;
    price: number;
    stock: string;
    createdAt: string;
    updatedAt: string;
}
