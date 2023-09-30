<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Rating Details</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Information relating to a user's product review.</p>

        <RatingsDetailItem :user="uid" :rating="id" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import RatingsDetailItem from "@/components/ratings/RatingsDetailItem.vue";

const route = useRoute();
const uid = String(route.params.id);
const id = String(route.params.rating);
</script>
