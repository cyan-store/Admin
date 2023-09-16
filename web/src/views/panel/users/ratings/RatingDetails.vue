<template>
    <div>
        <h2>Rating Details</h2>

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
