import type { Response } from "..";

// Login/User data
export interface Login extends Response {
    data: {
        token: string;
    };
}

export interface User extends Response {
    data: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        iat: number;
        exp: number;
    };
}

// Auth0
export interface Auth0 extends Response {
    data: {
        token: string;
        expire: number;
    };
}
