<template>
    <div>
        <h2>Order Details</h2>

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
