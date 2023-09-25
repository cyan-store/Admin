import type { Response } from "..";

// Orders
export interface RecentOrdersData {
    id: string;
    productID: string;
    transactionID: string;
    userID: string;
    status: string;
    quantity: string;
    amount: number;
    email: string;
    shipping: string;
    shippingName: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal: string;
    state: string;
    createdAt: string;
    updatedAt: string;
}

export interface RecentOrders extends Response {
    data: RecentOrdersData[];
}

// Ratings
export interface RecentRatingsData {
    id: string;
    user: string;
    name: string;
    description: string;
    rating: number;
    productID: string;
    createdAt: string;
    updatedAt: string;
}

export interface RecentRatings extends Response {
    data: RecentRatingsData[];
}
