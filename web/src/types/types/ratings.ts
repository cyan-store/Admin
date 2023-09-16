import type { Response } from "..";

export interface UserRatings extends Response {
    data: UserRatingData[];
}

export interface UserRating extends Response {
    data: UserRatingData;
}

export interface UserRatingData {
    id: string;
    name: string;
    description: null;
    rating: number;
    productID: string;
    createdAt: string;
    updatedAt: string;
}
