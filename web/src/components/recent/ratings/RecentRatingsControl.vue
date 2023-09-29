<template>
    <div>
        <div>
            <div class="join block">
                <button class="btn join-item w-[150px] max-md:hidden">Rating</button>
                <select class="select md:join-item select-bordered min-w-[240px] max-md:w-[calc(100vw-1rem)]" v-model="control.rating" :disabled="loading">
                    <option value="0">Any</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Star</option>
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                </select>
            </div>

            <div class="join block my-2">
                <button class="btn join-item w-[150px] max-md:hidden">User ID</button>
                <DelayedInputItem classes="input md:join-item input-bordered min-w-[240px] max-md:w-[calc(100vw-1rem)]" v-model="control.userID" placehold="User ID" />
            </div>

            <div class="join block mb-2">
                <button class="btn join-item w-[150px] max-md:hidden">Product ID</button>
                <DelayedInputItem classes="input md:join-item input-bordered min-w-[240px] max-md:w-[calc(100vw-1rem)]" v-model="control.productID" placehold="Product ID" />
            </div>

            <h4 class="my-4 text-sm opacity-70">Leave blank for any ID.</h4>
            <PaginateItem :page="control.page" :disabled="loading" @clicked="update" />
        </div>

        <div class="overflow-x-auto">
            <hr class="my-4" />

            <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
            <p v-else-if="errmsg" class="font-bold my-4 text-center">{{ errmsg }}</p>
            <template v-else>
                <p v-if="!data.length" class="font-bold my-4 text-center">No ratings found!</p>
                <table v-else class="table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Rating</th>
                            <th>Review</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RecentRatingsItem v-for="rating in data" :key="rating.id" :data="rating" />
                    </tbody>
                </table>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RecentRatingsData, RecentRatings } from "@/types/types/recent";
import { onMounted, reactive, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";

import PaginateItem from "@/components/general/PaginateItem.vue";
import DelayedInputItem from "@/components/general/DelayedInputItem.vue";
import RecentRatingsItem from "./RecentRatings.vue";

const control = reactive({
    page: 0,
    rating: 0,
    userID: "",
    productID: "",
});

const data = ref<RecentRatingsData[]>([]);
const loading = ref(false);
const errmsg = ref("");
const auth = useAuthStore();

const fetchRatings = async () => {
    const query = new URLSearchParams({
        page: control.page.toString(),
        rating: control.rating.toString(),
        user_id: control.userID,
        product_id: control.productID,
    });

    const ratings = await useRequest<RecentRatings>(`/recent/ratings?${query.toString()}`, "GET", null, auth.token, loading);

    if (!ratings.error && ratings.data.status === 200) {
        data.value.length = 0;
        data.value = ratings.json.data || [];

        return;
    }

    if (ratings?.json?.message) {
        errmsg.value = ratings.json.message;

        return;
    }

    errmsg.value = "HTTP Error.";
};

const update = (n: number) => (control.page = n);

watch(control, fetchRatings);
onMounted(fetchRatings);
</script>
