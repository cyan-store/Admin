import RecentOrders from "@/views/panel/recent/RecentOrders.vue";
import RecentRatings from "@/views/panel/recent/RecentRatings.vue";

export default [
    {
        path: "",
        name: "recent_orders",
        component: RecentOrders,
        meta: { title: "Recent Orders" },
    },

    {
        path: "ratings",
        name: "recent_ratings",
        component: RecentRatings,
        meta: { title: "Recent Ratings" },
    },
];
