import type { Ref } from "vue";

export async function useRequest<Type>(url: string, method: string, body: object | null, token: string, loading?: Ref<Boolean>) {
    const headers: {
        Authorization?: string;
        "Content-Type"?: string;
    } = {};

    let error = false;
    let json!: Type;

    if (loading) loading.value = true;
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body) headers["Content-Type"] = "application/json";

    const data = await fetch(import.meta.env.VITE_API + url, {
        headers,
        method,
        body: body ? JSON.stringify(body) : null,
    }).catch((err) => (error = err));

    if (error) {
        alert(
            JSON.stringify({
                title: "API Error",
                text: "Could not make a request to the API",
                icon: "error",
                confirmButton: "Okay",
            }),
        );
    } else {
        if (data.status != 200) {
            console.warn(`[api] Error with request ${url}!`);
            console.error(data);
        }

        json = await data.json();
    }

    if (loading) loading.value = false;

    return {
        error,
        data,
        json,
    };
}
