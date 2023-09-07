import { createRouter, createWebHistory } from "vue-router";

import auth from "@/router/routes/auth";

import HomeView from "../views/HomeView.vue";
import { isAuthed } from "@/use/useAuth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            meta: { requiresNoAuth: true },
            children: auth,
        },

        {
            path: "/@",
            meta: { requiresAuth: true },
            children: [
                {
                    path: "",
                    name: "home",
                    component: HomeView,
                },

                {
                    path: "about",
                    name: "about",
                    component: () => import("../views/AboutView.vue"),
                },
            ],
        },
    ],
});

router.beforeEach(async (to) => {
    document.title = `${to.meta.title} | ${import.meta.env.VITE_APP || "Admin"}`;

    // Check auth
    const authed = await isAuthed();

    // Cannot be logged in
    if (to.meta.requiresNoAuth && authed) {
        return { path: "/@" };
    }

    // Should be logged in
    if (to.meta.requiresAuth && !authed) {
        return { path: "/login" };
    }
});

export default router;
