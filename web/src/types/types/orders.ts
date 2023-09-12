import type { Response } from "..";

export interface UserOrders extends Response {
    data: UserOrderData[];
}

export interface UserOrderData {
    id: string;
    productID: string;
    status: string;
    quantity: string;
    amount: number;
    country: string;
    postal: string;
    shipping: string;
    createdAt: string;
    updatedAt: string;
}
