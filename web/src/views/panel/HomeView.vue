<template>
    <div>
        <h2>Recent {{ recent }}</h2>

        <button @click="recent = 'Orders'" :disabled="isRecent">Orders</button>
        <button @click="recent = 'Ratings'" :disabled="!isRecent">Ratings</button>

        <hr />

        <div>
            <RecentOrdersControl v-if="isRecent" />
            <RecentRatingsControl v-else />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import RecentOrdersControl from "@/components/recent/orders/RecentOrdersControl.vue";
import RecentRatingsControl from "@/components/recent/ratings/RecentRatingsControl.vue";

const recent = ref("Orders");

const isRecent = computed(() => recent.value === "Orders");
</script>
