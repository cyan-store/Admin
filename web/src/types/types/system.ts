import type { Response } from "..";

export interface SystemSettings extends Response {
    data: SystemSettingsData;
}

export interface SystemSettingsData {
    currency: string;
    shipping: string;
    shippingCost: number;
    purchase: boolean;
    ratings: boolean;
}

// Logs
export interface SystemLogs extends Response {
    data: SystemLogsData[];
}

export interface SystemLogsData {
    id: string;
    user: string;
    path: string;
    method: SystemLogMethod;
    ip: string;
    date: number;
    from_now: string;
}

export enum SystemLogMethod {
    Delete = "DELETE",
    Post = "POST",
    Get = "GET"
}

