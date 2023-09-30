<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Order Details</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Information relating to a user's order.</p>

        <OrdersDetailItem :user="uid" :order="id" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import OrdersDetailItem from "@/components/orders/details/OrdersDetailItem.vue";

const route = useRoute();
const uid = String(route.params.id);
const id = String(route.params.order);
</script>
