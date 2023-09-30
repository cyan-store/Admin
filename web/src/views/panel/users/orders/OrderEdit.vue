<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Edit Order Details</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Update/modify a user's order.</p>

        <OrdersDetailEditControl :user="uid" :order="id" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import OrdersDetailEditControl from "@/components/orders/details/edit/OrdersDetailEditControl.vue";

const route = useRoute();
const uid = String(route.params.id);
const id = String(route.params.order);
</script>
