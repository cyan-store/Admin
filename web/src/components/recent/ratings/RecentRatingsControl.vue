<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div>
            <select v-model="control.rating" :disabled="loading">
                <option value="0">Any</option>
                <option value="1">1 Star</option>
                <option value="2">2 Star</option>
                <option value="3">3 Star</option>
                <option value="4">4 Star</option>
                <option value="5">5 Star</option>
            </select>

            <div>
                <h4>Leave blank for any.</h4>

                <DelayedInputItem v-model="control.userID" placehold="User ID" />
                <DelayedInputItem v-model="control.productID" placehold="Product ID" />
            </div>
        </div>

        <div>
            <p v-if="errmsg">{{ errmsg }}</p>
            <template v-else>
                <p v-if="!data.length">No ratings found!</p>
                <table v-else>
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

        <PaginateItem :page="control.page" :disabled="loading" @clicked="update" />
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
