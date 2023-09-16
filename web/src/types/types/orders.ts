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

// Order Details
export interface OrderDetails extends Response {
    data: OrderDetailsData;
}

export interface OrderDetailsData {
    order: OrderDetailsInfo;
    products: OrderProducts[];
}

export interface OrderDetailsInfo {
    id: string;
    productID: string;
    transactionID: string;
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

export interface OrderProducts {
    info: {
        id: string;
        title: string;
        images: string;
        price: number;
        stock: string;
    };
    amount: string;
}
