import LoginView from "@/views/auth/LoginView.vue";
import IndexView from "@/views/IndexView.vue";

export default [
    {
        path: "",
        name: "index",
        component: IndexView,
        meta: { title: "Unknown" },
    },

    {
        path: "login",
        name: "login",
        component: LoginView,
        meta: { title: "Login" },
    },
];
