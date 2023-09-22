import type { Response } from "..";

export interface UploadResponse extends Response {
    data: UploadResponseData;
}

export interface UploadResponseData {
    id: string;
    images: string[];
}

export interface RemoveResponse extends Response {
    data: RemoveResponseData;
}

export interface RemoveResponseData {
    images: string[];
}
