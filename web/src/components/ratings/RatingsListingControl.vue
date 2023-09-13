<template>
    <div>
        <button @click="updateSort">{{ sort.toUpperCase() }}</button>

        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>
        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Display Name</th>
                    <th>Description</th>
                    <th>Rating</th>
                    <th>Product ID</th>
                    <th>Created</th>
                    <th>Updated</th>
                </tr>
            </thead>
            <tbody>
                <p v-if="!ratings.length && !loading">Nothing found!</p>
                <RatingsListingItem v-for="rating in ratings" :key="rating.id" :data="rating" />
            </tbody>
        </table>

        <PaginateItem :page="page" :disabled="loading" @clicked="update" />
    </div>
</template>

<script lang="ts" setup>
import type { UserRatings, UserRatingData } from "@/types/types/ratings";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { onMounted, ref, watch } from "vue";

import PaginateItem from "@/components/general/PaginateItem.vue";
import RatingsListingItem from "./RatingsListingItem.vue";

const props = defineProps<{ id: string }>();
const auth = useAuthStore();

const ratings = ref<UserRatingData[]>([]);
const page = ref(0);

const sort = ref("desc");
const loading = ref(false);
const errmsg = ref("");

const update = (n: number) => (page.value = n);
const updateSort = () => {
    sort.value = sort.value == "asc" ? "desc" : "asc";
    page.value = 0;
};

const getRatings = async () => {
    ratings.value.length = 0;

    const cfg = new URLSearchParams({ page: String(page.value), sort: sort.value }).toString();
    const ratingsListing = await useRequest<UserRatings>(`/users/${props.id}/ratings?${cfg}`, "GET", null, auth.token, loading);

    if (!ratingsListing.error && ratingsListing.data.status === 200) {
        ratings.value = ratingsListing.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

onMounted(getRatings);
watch(page, getRatings);
watch(sort, getRatings);
</script>
