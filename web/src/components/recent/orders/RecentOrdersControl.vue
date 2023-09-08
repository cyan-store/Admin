<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div>
            <select v-model="control.shipping" :disabled="loading">
                <option value="any">Any</option>
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELED">Canceled</option>
                <option value="UNKNOWN">Unknown</option>
            </select>

            <select v-model="control.payment" :disabled="loading">
                <option value="any">Any</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELED">Canceled</option>
                <option value="REFUNDED">Refunded</option>
            </select>
        </div>

        <div>
            <p v-if="errmsg">{{ errmsg }}</p>
            <template v-else>
                <p v-if="!data.length">No orders found!</p>
                <table v-else>
                    <thead>
                        <tr>
                            <td>User ID</td>
                            <td>Transaction</td>
                            <td>Products</td>
                            <td>Quantity</td>
                            <td>Amount</td>
                            <td>Email</td>
                            <td>Payment Status</td>
                            <td>Shipping Status</td>
                            <td>Created At</td>
                            <td>Updated At</td>
                            <td>Details</td>
                        </tr>
                    </thead>
                    <tbody>
                        <RecentOrdersItem v-for="order in data" :key="order.id" :data="order" />
                    </tbody>
                </table>
            </template>
        </div>

        <PaginateItem :page="control.page" :disabled="loading" @clicked="update" />
    </div>
</template>

<script lang="ts" setup>
import type { RecentOrdersData, RecentOrders } from "@/types/recent";
import { onMounted, reactive, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";

import PaginateItem from "@/components/general/PaginateItem.vue";
import RecentOrdersItem from "./RecentOrders.vue";

const control = reactive({
    page: 0,
    payment: "any",
    shipping: "any",
});

const data = ref<RecentOrdersData[]>([]);
const loading = ref(false);
const errmsg = ref("");
const auth = useAuthStore();

const fetchOrders = async () => {
    const query = new URLSearchParams({
        page: control.page.toString(),
        payment: control.payment,
        shipping: control.shipping,
    });

    const orders = await useRequest<RecentOrders>(`/recent/orders?${query.toString()}`, "GET", null, auth.token, loading);

    if (!orders.error && orders.data.status === 200) {
        data.value.length = 0;
        data.value = orders.json.data || [];

        return;
    }

    if (orders?.json?.message) {
        errmsg.value = orders.json.message;

        return;
    }

    errmsg.value = "HTTP Error.";
};

const update = (n: number) => (control.page = n);

watch(control, fetchOrders);
onMounted(fetchOrders);
</script>
