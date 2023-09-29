<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">User Ratings</h2>
        <p class="text-sm font-bold opacity-60 mb-4">A list of a user's ratings. Ordered by date.</p>

        <RatingsListingControl :id="user" />
        <button class="btn btn-sm mt-4" @click="back">Back to Profile</button>
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
