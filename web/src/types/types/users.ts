import type { Response } from "..";

export interface Auth0Users extends Response {
    data: Auth0UserData[];
}

export interface Auth0User extends Response {
    data: Auth0UserData;
}

export interface Auth0UserData {
    created_at: string;
    email: string;
    email_verified: boolean;
    family_name?: string;
    given_name?: string;
    identities: Auth0Identities[];
    locale?: string;
    name: string;
    nickname: string;
    picture: string;
    updated_at: string;
    user_id: string;
    last_login: string;
    last_ip: string;
    logins_count: number;
}

export interface Auth0Identities {
    provider: string;
    user_id: string;
    connection: string;
    isSocial: boolean;
}
