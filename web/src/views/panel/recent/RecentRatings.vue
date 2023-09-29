<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Recent Ratings</h2>
        <p class="text-sm font-bold opacity-60 mb-4">A list of recent user created ratings ordered by date.</p>

        <RecentRatingsControl />
    </div>
</template>

<script lang="ts" setup>
import RecentRatingsControl from "@/components/recent/ratings/RecentRatingsControl.vue";
</script>
