<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p v-else-if="errmsg" class="font-bold my-[10rem] text-center">{{ errmsg }}</p>
        <div v-else-if="!errmsg && orderData.order">
            <hr class="my-4" />

            <h4 class="font-bold text-lg mb-2">Transaction Information</h4>
            <table class="table">
                <tbody>
                    <tr>
                        <th>Order ID</th>
                        <td>{{ orderData.order.id }}</td>
                    </tr>
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
                        <td :title="useDate(orderData.order.createdAt)">{{ useNow(orderData.order.createdAt) }}</td>
                    </tr>
                    <tr>
                        <th>Updated</th>
                        <td :title="useDate(orderData.order.updatedAt)">{{ useNow(orderData.order.updatedAt) }}</td>
                    </tr>
                </tbody>
            </table>

            <hr class="my-4" />

            <div class="my-8">
                <h4 class="font-bold text-lg mb-2">Product Information</h4>
                <div>
                    <OrdersDetailProduct v-for="product in orderData.products" :key="product.info.id" :data="product" />
                </div>
            </div>

            <hr class="my-4" />

            <div>
                <h4 class="font-bold text-lg mb-2">Transaction Information</h4>

                <div class="lg:flex max-lg:my-4 max-lg:text-center">
                    <table class="table lg:w-[50%]">
                        <tbody>
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
                        </tbody>
                    </table>

                    <div class="lg:w-[50%] max-lg:mt-8">
                        <iframe class="rounded-md w-full h-[400px]" frameborder="0" :src="mapURL"></iframe>
                    </div>
                </div>
            </div>

            <hr class="my-4" />

            <div class="grid md:grid-cols-2 gap-2 my-4">
                <button class="btn btn-primary" @click="openEdit">Edit Order</button>
                <button class="btn btn-error" @click="deleteOrder">Delete Order</button>
            </div>
        </div>

        <RouterLink class="btn btn-sm" :to="`/@/users/${props.user}/orders`">Back to Orders</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import type { OrderDetails, OrderDetailsData } from "@/types/types/orders";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useDate, useNow } from "@/use/useDate";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";

import OrdersDetailProduct from "./OrdersDetailProduct.vue";

const auth = useAuthStore();
const router = useRouter();
const $toast = useToast();
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

const deleteOrder = () => {
    Swal.fire({
        title: "Are you sure you want to remove this order?",
        icon: "warning",
        text: "This should only be done under very specific circumstances. ",
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        const rdata = await useRequest<Response>(`/users/${props.user}/orders/${props.order}`, "DELETE", null, auth.token, loading);

        if (!rdata.error && rdata.data.status === 200) {
            $toast.success(`Removed order from ${orderData.value.order?.email}.`);
            orderData.value = {};
            errmsg.value = "";

            router.push(`/@/users/${props.user}/orders`);
            return;
        }

        $toast.error("Could not remove order: HTTP Error.");
    });
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
