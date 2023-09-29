<template>
    <div>
        <div class="md:flex">
            <PaginateItem class="max-md:w-[calc(100vw-1rem)] max-md:text-center" :page="page" :disabled="loading" @clicked="update" />
            <button class="btn btn-sm btn-secondary md:ml-2 max-md:w-[calc(100vw-1rem)] max-md:mt-2" @click="updateSort" :disabled="loading">
                {{ sort.toUpperCase() }}
            </button>
        </div>

        <hr class="my-4" />

        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p v-else-if="errmsg" class="font-bold my-4 text-center">{{ errmsg }}</p>
        <template v-else>
            <p v-if="!ratings.length && !loading" class="font-bold my-[10rem] text-center">Nothing found!</p>
            <table v-else class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Display Name</th>
                        <th>Description</th>
                        <th>Rating</th>
                        <th>Product ID</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <RatingsListingItem v-for="rating in ratings" :key="rating.id" :data="rating" />
                </tbody>
            </table>
        </template>
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
