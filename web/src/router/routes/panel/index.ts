import PanelView from "@/views/panel/PanelView.vue";

import system from "@/router/routes/panel/system";
import recent from "@/router/routes/panel/recent";
import users from "@/router/routes/panel/users";
import products from "@/router/routes/panel/products";

export default [
    {
        path: "",
        name: "home",
        component: PanelView,
        meta: { title: "Home" },
    },

    {
        path: "system",
        name: "system",
        children: system,
        meta: { title: "System Settings" },
    },

    {
        path: "recent",
        name: "recent",
        children: recent,
        meta: { title: "Recent" },
    },

    {
        path: "users",
        name: "users",
        children: users,
        meta: { title: "Users" },
    },

    {
        path: "products",
        name: "products",
        children: products,
        meta: { title: "Products" },
    },
];
