import UsersListing from "@/views/panel/users/UsersListing.vue";
import UserDetails from "@/views/panel/users/UserDetails.vue";

import OrderListing from "@/views/panel/users/orders/OrderListing.vue";
import OrderDetails from "@/views/panel/users/orders/OrderDetails.vue";
import OrderEdit from "@/views/panel/users/orders/OrderEdit.vue";

import RatingListing from "@/views/panel/users/ratings/RatingListing.vue";
import RatingDetails from "@/views/panel/users/ratings/RatingDetails.vue";

export default [
    {
        path: "",
        name: "users",
        component: UsersListing,
        meta: { title: "Users Listing" },
    },

    {
        path: ":id",
        name: "user_data",
        children: [
            {
                path: "",
                name: "user_details",
                component: UserDetails,
                meta: { title: "User Details" },
            },

            {
                path: "orders",
                name: "user_orders_data",
                children: [
                    {
                        path: "",
                        name: "user_orders",
                        component: OrderListing,
                        meta: { title: "Order Listing" },
                    },

                    {
                        path: ":order",
                        name: "user_orders_details_data",
                        children: [
                            {
                                path: "",
                                name: "user_orders_details",
                                component: OrderDetails,
                                meta: { title: "Order Details" },
                            },

                            {
                                path: "edit",
                                name: "user_orders_edit",
                                component: OrderEdit,
                                meta: { title: "Edit Order Details" },
                            },
                        ],
                    },
                ],
            },

            {
                path: "ratings",
                name: "user_ratings_data",
                children: [
                    {
                        path: "",
                        name: "user_ratings",
                        component: RatingListing,
                    },

                    {
                        path: ":rating",
                        name: "user_ratings_details",
                        component: RatingDetails,
                    },
                ],
            },
        ],
    },
];
