<template>
    <div>
        <h2>Order Listing</h2>

        <OrdersListingControl :id="user" />
        <button @click="back">Back to Profile</button>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import OrdersListingControl from "@/components/orders/OrdersListingControl.vue";

const route = useRoute();
const router = useRouter();
const user = String(route.params.id);

const back = () => router.push(`/@/users/${user}`);
</script>
