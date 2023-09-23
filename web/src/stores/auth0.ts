import type { Auth0 } from "@/types/types/auth";
import { useRequest } from "@/use/useRequest";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useAuth0Store = defineStore("auth0", () => {
    const token = ref("");

    const getToken = async (jwt: string, loading: Ref<boolean>) => {
        const authToken = await useRequest<Auth0>("/auth/token", "POST", {}, jwt, loading);

        if (!authToken.error && authToken.data.status === 200 && authToken.json?.data?.token) {
            token.value = authToken.json?.data?.token;

            return true;
        }

        return false;
    };

    const removeToken = () => (token.value = "");
    const hasToken = () => !!token.value;

    return { token, getToken, removeToken, hasToken };
});
