<template>
    <div>
        <h2>Edit Order Details</h2>

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
