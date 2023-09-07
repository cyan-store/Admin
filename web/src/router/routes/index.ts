import HomeView from "@/views/panel/HomeView.vue";

export default [
    {
        path: "",
        name: "home",
        component: HomeView,
    },

    {
        path: "about",
        name: "about",
        component: () => import("../../views/panel/AboutView.vue"),
    },
];
