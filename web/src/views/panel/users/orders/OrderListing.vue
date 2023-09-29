<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">User Orders</h2>
        <p class="text-sm font-bold opacity-60 mb-4">A list of a user's orders. Ordered by date.</p>

        <OrdersListingControl :id="user" />
        <button class="btn btn-sm mt-4" @click="back">Back to Profile</button>
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
