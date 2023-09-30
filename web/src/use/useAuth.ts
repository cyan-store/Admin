import type { User } from "@/types/types/auth";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "./useRequest";

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

    auth.logout();
    return false;
}
