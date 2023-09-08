import { useAuthStore } from "@/stores/auth";
import { useRequest } from "./useRequest";

interface User {
    statusCode: number;
    message: string;
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

// Check authorization
// Update stores & localStorage
export async function isAuthed() {
    const storage = localStorage.getItem("token");
    const auth = useAuthStore();
    if (!storage) return false;

    const user = await useRequest<User>("/auth", "POST", {}, storage || "");

    if (!user.error && user.data.status === 200 && user.json.data.id) {
        auth.setData(user.json.data.id, user.json.data.name, user.json.data.email, user.json.data.exp, storage);
        return true;
    }

    localStorage.removeItem("token");
    return false;
}
