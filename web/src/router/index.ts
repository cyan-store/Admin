import { createRouter, createWebHistory } from "vue-router";
import { isAuthed } from "@/use/useAuth";

import auth from "@/router/routes/auth";
import index from "@/router/routes/panel/index";

// TODO: 404 page
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
            children: index,
        },
    ],
});

router.beforeEach(async (to) => {
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

    document.title = `${to.meta.title} | ${import.meta.env.VITE_APP || "Admin"}`;
});

export default router;
