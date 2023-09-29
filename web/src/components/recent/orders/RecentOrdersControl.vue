<template>
    <div>
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-2 lg:max-w-[calc(100vw-20rem-2rem)] max-w-[calc(100vw-1rem)]">
            <div class="join">
                <button class="btn join-item">Shipping</button>
                <select class="select join-item select-bordered w-full" v-model="control.shipping" :disabled="loading">
                    <option value="any">Any</option>
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELED">Canceled</option>
                    <option value="UNKNOWN">Unknown</option>
                </select>
            </div>

            <div class="join">
                <button class="btn join-item">Payment</button>
                <select class="select join-item select-bordered w-full" v-model="control.payment" :disabled="loading">
                    <option value="any">Any</option>
                    <option value="UNPAID">Unpaid</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELED">Canceled</option>
                    <option value="REFUNDED">Refunded</option>
                </select>
            </div>

            <PaginateItem :page="control.page" :disabled="loading" @clicked="update" />
        </div>

        <div class="overflow-x-auto">
            <hr class="my-4" />
            
            <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
            <p v-else-if="errmsg" class="font-bold my-4 text-center">{{ errmsg }}</p>
            <template v-else>
                <p v-if="!data.length" class="font-bold my-4 text-center">No orders found!</p>
                <table v-else class="table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Transaction</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Email</th>
                            <th>Payment Status</th>
                            <th>Shipping Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RecentOrdersItem v-for="order in data" :key="order.id" :data="order" />
                    </tbody>
                </table>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RecentOrdersData, RecentOrders } from "@/types/types/recent";
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
