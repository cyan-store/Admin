import type { Response } from "..";

export interface Stats extends Response {
    data: StatsData;
}

export interface StatsData {
    products: number;
    orders: number;
    ratings: number;
    admins: number;
}
