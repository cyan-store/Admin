import ProductsListing from "@/views/panel/products/ProductsListing.vue";
import ProductDetails from "@/views/panel/products/ProductDetails.vue";
import ProductCreate from "@/views/panel/products/ProductCreate.vue";
import ProductEdit from "@/views/panel/products/ProductEdit.vue";

export default [
    {
        path: "",
        name: "products",
        component: ProductsListing,
        meta: { title: "Products Listing" },
    },

    {
        path: "new",
        name: "product_create",
        component: ProductCreate,
        meta: { title: "New Product" },
    },

    {
        path: ":id",
        name: "product_data",
        children: [
            {
                path: "",
                name: "product_details",
                component: ProductDetails,
                meta: { title: "Product Details" },
            },

            {
                path: "edit",
                name: "product_details_edit",
                component: ProductEdit,
                meta: { title: "Edit Product Details" },
            },
        ],
    },
];
