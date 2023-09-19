import RecentView from "@/views/panel/RecentView.vue";

import users from "@/router/routes/panel/users";
import products from "@/router/routes/panel/products";

export default [
    {
        path: "",
        name: "home",
        component: RecentView,
        meta: { title: "Home" },
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
