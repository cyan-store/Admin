<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg && orderData.order">
            <pre>{{ orderDetails }}</pre>
            <pre>{{ orderProductsData }}</pre>

            <div>
                <h4>Products</h4>
                <ul>
                    <li v-for="product in orderProductsData" :key="product.info.id">
                        <div>
                            <RouterLink :to="`/@/products/${product.info.id}`">{{ product.info.title }}</RouterLink>
                            <b> - ({{ product.info.id }})</b>
                        </div>

                        <div>
                            <button @click="addProduct(product)" :disabled="parseInt(product.amount) >= max.amount - 1">+</button>

                            <span>x{{ product.amount }} </span>

                            <button @click="removeProduct(product)" :disabled="isMinProducts(product.amount)">-</button>
                        </div>
                    </li>
                </ul>

                <OrdersDetailEditSearch @push-product="addNewProduct" />
            </div>

            <hr />

            <div>
                <h4>Transaction ID</h4>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>

        <RouterLink :to="`/@/users/${props.user}/orders/${props.order}`">Back to Details</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import type { OrderDetails, OrderDetailsData, OrderProducts } from "@/types/types/orders";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { onMounted, ref, reactive, watch } from "vue";

import OrdersDetailEditSearch from "./OrdersDetailEditSearch.vue";

const max = {
    items: 11,
    amount: 21,
};

const auth = useAuthStore();
const props = defineProps<{
    user: string;
    order: string;
}>();

// Request data
const loading = ref(false);
const errmsg = ref("");
const orderData = ref<Partial<OrderDetailsData>>({});

// User modified data
const orderProductsData = ref<OrderProducts[]>([]);
const orderDetails = reactive({
    productID: [] as string[],
    transactionID: "",
    status: "",
    quantity: [] as number[],
    amount: 0,
    email: "",
    shipping: "",
    shippingName: "",
    city: "",
    country: "",
    line1: "",
    line2: "",
    postal: "",
    state: "",
});

const getOrder = async () => {
    const odata = await useRequest<OrderDetails>(`/users/${props.user}/orders/${props.order}`, "GET", null, auth.token, loading);

    if (!odata.error && odata.data.status === 200) {
        setDetails(odata.json.data);
        orderData.value = odata.json.data;
        errmsg.value = "";

        return;
    }

    if (odata.data.status === 404) {
        errmsg.value = "Order not found!";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const setDetails = (data: OrderDetailsData) => {
    orderDetails.productID = data.order.productID.split(",");
    orderDetails.transactionID = data.order.transactionID;
    orderDetails.status = data.order.status;
    orderDetails.quantity = data.order.quantity.split(",").map((n) => parseInt(n));
    orderDetails.amount = data.order.amount;
    orderDetails.email = data.order.email;
    orderDetails.shipping = data.order.shipping;
    orderDetails.shippingName = data.order.shippingName;
    orderDetails.city = data.order.city;
    orderDetails.country = data.order.country;
    orderDetails.line1 = data.order.line1;
    orderDetails.line2 = data.order.line2;
    orderDetails.postal = data.order.postal;
    orderDetails.state = data.order.state;

    orderProductsData.value = data.products;
};

const addProduct = (product: OrderProducts) => (product.amount = String(parseInt(product.amount) + 1));
const removeProduct = (product: OrderProducts) => {
    product.amount = String(parseInt(product.amount) - 1);

    const ids = orderProductsData.value.map((n) => n.info.id);
    const idx = ids.indexOf(product.info.id);

    if (idx === -1) return;
    if (parseInt(product.amount) <= 0) {
        orderProductsData.value.splice(idx, 1);
    }
};

const addNewProduct = (product: OrderProducts) => {
    const ids = orderProductsData.value.map((n) => n.info.id);

    // TODO: Custom alert, use toast
    if (ids.includes(product.info.id)) {
        alert("Cannot add duplicate product!");
        return;
    }

    orderProductsData.value.push(product);
};

const isMinProducts = (amount: string) => {
    return orderProductsData.value.length <= 1 && parseInt(amount) <= 1;
};

onMounted(getOrder);
watch(
    () => orderProductsData,
    () => {
        const ids = orderProductsData.value.map((n) => n.info.id);
        const quantity = orderProductsData.value.map((n) => parseInt(n.amount));

        orderDetails.productID = ids;
        orderDetails.quantity = quantity;
    },

    { deep: true },
);
</script>
