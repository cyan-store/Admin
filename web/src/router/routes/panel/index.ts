import RecentView from "@/views/panel/RecentView.vue";
import users from "@/router/routes/panel/users";

export default [
    {
        path: "",
        name: "home",
        component: RecentView,
        meta: { title: "Home" },
    },

    {
        path: "about",
        name: "about",
        component: () => import("../../../views/panel/AboutView.vue"),
        meta: { title: "About" },
    },

    {
        path: "users",
        name: "users",
        children: users,
        meta: { title: "Users" },
    },
];
