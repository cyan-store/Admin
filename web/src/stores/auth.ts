import { reactive, ref, computed } from "vue";
import { defineStore } from "pinia";
import { isAuthed } from "@/use/useAuth";

export const useAuthStore = defineStore("auth", () => {
    const token = ref("");
    const userData = reactive({
        id: "",
        name: "",
        email: "",
        expire: 0,
    });

    const authorized = computed(() => userData.id.length);
    let timer = 0;

    const login = async (token: string) => {
        localStorage.setItem("token", token);

        const authed = await isAuthed();

        if (!authed) {
            throw new Error("Could not login.");
        }
    };

    const logout = () => {
        userData.id = "";
        userData.name = "";
        userData.email = "";
        userData.expire = 0;
        token.value = "";

        localStorage.clear();
        clearInterval(timer);

        location.href = "/login";
    };

    const setData = (id: string, name: string, email: string, expire: number) => {
        userData.id = id;
        userData.name = name;
        userData.email = email;
        userData.expire = expire;

        timer = setInterval(() => {
            if (Math.floor(Date.now() / 1000) > expire) {
                logout();
            }
        }, 60000);
    };

    return { token, userData, authorized, login, logout, setData };
});
