<template>
    <div>
        <button @click="updateSort">{{ sort.toUpperCase() }}</button>

        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>
        <table v-else>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product IDs</th>
                    <th>Status</th>
                    <th>Amount Paid</th>
                    <th>Country</th>
                    <th>Shipping Postal</th>
                    <th>Shipping Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <p v-if="!orders.length && !loading">Nothing found!</p>
                <OrdersListingItemVue v-for="order in orders" :key="order.id" :data="order" />
            </tbody>
        </table>

        <PaginateItem :page="page" :disabled="loading" @clicked="update" />
    </div>
</template>

<script lang="ts" setup>
import type { UserOrders, UserOrderData } from "@/types/types/orders";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { onMounted, ref, watch } from "vue";

import PaginateItem from "@/components/general/PaginateItem.vue";
import OrdersListingItemVue from "./OrdersListingItem.vue";

const props = defineProps<{ id: string }>();
const auth = useAuthStore();

const orders = ref<UserOrderData[]>([]);
const page = ref(0);

const sort = ref("desc");
const loading = ref(false);
const errmsg = ref("");

const update = (n: number) => (page.value = n);
const updateSort = () => {
    sort.value = sort.value == "asc" ? "desc" : "asc";
    page.value = 0;
};

const getOrders = async () => {
    orders.value.length = 0;

    const cfg = new URLSearchParams({ page: String(page.value), sort: sort.value }).toString();
    const orderListing = await useRequest<UserOrders>(`/users/${props.id}/orders?${cfg}`, "GET", null, auth.token, loading);

    if (!orderListing.error && orderListing.data.status === 200) {
        orders.value = orderListing.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

onMounted(getOrders);
watch(page, getOrders);
watch(sort, getOrders);
</script>
