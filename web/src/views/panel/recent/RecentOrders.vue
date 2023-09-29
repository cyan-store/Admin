<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Recent Orders</h2>
        <p class="text-sm font-bold opacity-60 mb-4">A list of recent purchases ordered by date.</p>

        <RecentOrdersControl />
    </div>
</template>

<script lang="ts" setup>
import RecentOrdersControl from "@/components/recent/orders/RecentOrdersControl.vue";
</script>
