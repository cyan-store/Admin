<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg && orderData.order">
            <h4>Order ID: {{ orderData.order.id }}</h4>

            <table>
                <tr>
                    <th>Transaction ID</th>
                    <td>{{ orderData.order.transactionID }}</td>
                </tr>
                <tr>
                    <th>Payment Status</th>
                    <td>{{ orderData.order.status }}</td>
                </tr>
                <tr>
                    <th>Total Amount Purchased</th>
                    <td>{{ orderSum }}x</td>
                </tr>
                <tr>
                    <th>Amount Paid</th>
                    <td>${{ (orderData.order.amount / 100).toFixed(2) }}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>
                        <a :href="`mailto:${orderData.order.email}`">{{ orderData.order.email }}</a>
                    </td>
                </tr>
                <tr>
                    <th>Created</th>
                    <td>{{ orderData.order.createdAt }}</td>
                </tr>
                <tr>
                    <th>Updated</th>
                    <td>{{ orderData.order.updatedAt }}</td>
                </tr>
            </table>

            <hr />

            <div>
                <h4>Product Information</h4>
                <div>
                    <OrdersDetailProduct v-for="product in orderData.products" :key="product.info.id" :data="product" />
                </div>
            </div>

            <hr />

            <div>
                <h4>Shipping Information</h4>
                <table>
                    <tr>
                        <th>Shipping Status</th>
                        <td>{{ orderData.order.shipping }}</td>
                    </tr>
                    <tr>
                        <th>Shipping Name</th>
                        <td>{{ orderData.order.shippingName }}</td>
                    </tr>
                    <tr>
                        <th>Country</th>
                        <td>{{ orderData.order.country }}</td>
                    </tr>
                    <tr>
                        <th>State/Province</th>
                        <td>{{ orderData.order.state }}</td>
                    </tr>
                    <tr>
                        <th>City</th>
                        <td>{{ orderData.order.city }}</td>
                    </tr>
                    <tr>
                        <th>Postal</th>
                        <td>{{ orderData.order.postal }}</td>
                    </tr>
                    <tr v-if="orderData.order.line1">
                        <th>Line 1</th>
                        <td>{{ orderData.order.line1 }}</td>
                    </tr>
                    <tr v-if="orderData.order.line2">
                        <th>Line 2</th>
                        <td>{{ orderData.order.line2 }}</td>
                    </tr>
                </table>

                <div>
                    <iframe class="rounded-md" width="500" height="500" frameborder="0" :src="mapURL"></iframe>
                </div>

                <div>
                    <button @click="openEdit">Edit Order</button>
                    <button @click="deleteOrder">Delete Order</button>
                </div>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>

        <RouterLink :to="`/@/users/${props.user}/orders`">Back to Orders</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import type { OrderDetails, OrderDetailsData } from "@/types/types/orders";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

import OrdersDetailProduct from "./OrdersDetailProduct.vue";

const auth = useAuthStore();
const router = useRouter();
const props = defineProps<{
    user: string;
    order: string;
}>();

const orderData = ref<Partial<OrderDetailsData>>({});
const loading = ref(false);
const errmsg = ref("");

const getOrder = async () => {
    const odata = await useRequest<OrderDetails>(`/users/${props.user}/orders/${props.order}`, "GET", null, auth.token, loading);

    if (!odata.error && odata.data.status === 200) {
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

const openEdit = () => {
    router.push(`/@/users/${props.user}/orders/${props.order}/edit`);
};

// TODO: Warn user that this should only be done under very specific circumstances
const deleteOrder = async () => {
    if (!confirm("Are you sure you want to remove this order?")) return;
    const rdata = await useRequest<Response>(`/users/${props.user}/orders/${props.order}`, "DELETE", null, auth.token, loading);

    if (!rdata.error && rdata.data.status === 200) {
        orderData.value = {};
        errmsg.value = "";

        router.push(`/@/users/${props.user}/orders`);
        return;
    }

    // TODO: Use custom alert, maybe a toast
    alert("HTTP Error.");
};

const mapURL = computed(() => {
    const params = new URLSearchParams({
        hl: "en",
        q: orderData.value.order?.postal || "",
        output: "embed",
    });

    return `https://maps.google.com/maps?${params.toString()}`;
});

const orderSum = computed(() => {
    if (!orderData.value.order) return "";

    return orderData.value.order.quantity
        .split(",")
        .map((n) => parseInt(n))
        .reduce((a, b) => a + b);
});

onMounted(getOrder);
</script>
