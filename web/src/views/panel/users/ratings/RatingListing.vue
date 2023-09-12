<template>
    <div>
        <h2>Ratings Listing</h2>

        <RatingsListingControl :id="user" />
        <button @click="back">Back to Profile</button>
    </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import RatingsListingControl from "@/components/ratings/RatingsListingControl.vue";

const route = useRoute();
const router = useRouter();
const user = String(route.params.id);

const back = () => router.push(`/@/users/${user}`);
</script>
