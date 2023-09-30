<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p v-else-if="errmsg" class="font-bold my-[10rem] text-center">{{ errmsg }}</p>
        <div v-else>
            <div>
                <strong>Display Name: </strong>
                <span>{{ ratingData.name }}</span>
            </div>

            <div class="flex">
                <strong class="mr-2">Rating:</strong>

                <StarRating class="relative bottom-[2px]" :star-size="15" :rating="ratingData.rating" :read-only="true" :show-rating="false" />
            </div>

            <div>
                <template v-if="!ratingData.description">
                    <strong>Description: </strong>
                    <span class="italic">No content provided.</span>
                </template>
                <textarea
                    v-else
                    class="textarea textarea-bordered my-4 max-md:w-[calc(100vw-1rem)]"
                    :value="ratingData.description"
                    readonly
                ></textarea>
            </div>

            <hr class="my-4" />

            <div>
                <strong>Created: </strong>
                <span :title="useDate(ratingData.createdAt)">{{ useNow(ratingData.createdAt) }}</span>
            </div>

            <div>
                <strong>Updated: </strong>
                <span :title="useDate(ratingData.updatedAt)">{{ useNow(ratingData.updatedAt) }}</span>
            </div>

            <div class="my-4">
                <button class="btn btn-primary max-md:w-[calc(100vw-1rem)]" @click="productPage">Product Page</button>
                <button class="btn btn-error max-md:w-[calc(100vw-1rem)] md:ml-2 max-md:my-2" @click="deleteRating">Delete Rating</button>
            </div>
        </div>

        <div>
            <RouterLink class="btn btn-sm" :to="`/@/users/${props.user}/ratings`">Back to Ratings</RouterLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UserRating, UserRatingData } from "@/types/types/ratings";
import type { Response } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useDate, useNow } from "@/use/useDate";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

import StarRating from "vue-star-rating";

const auth = useAuthStore();

const $toast = useToast();
const router = useRouter();
const props = defineProps<{
    user: string;
    rating: string;
}>();

const ratingData = ref<Partial<UserRatingData>>({});
const loading = ref(false);
const errmsg = ref("");

const getRating = async () => {
    const rdata = await useRequest<UserRating>(`/users/${props.user}/ratings/${props.rating}`, "GET", null, auth.token, loading);

    if (!rdata.error && rdata.data.status === 200) {
        ratingData.value = rdata.json.data;
        errmsg.value = "";

        return;
    }

    if (rdata.data.status === 404) {
        errmsg.value = "Rating not found!";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const deleteRating = async () => {
    if (!confirm("Are you sure you want to remove this rating?")) return;
    const rdata = await useRequest<Response>(`/users/${props.user}/ratings/${props.rating}`, "DELETE", null, auth.token, loading);

    if (!rdata.error && rdata.data.status === 200) {
        ratingData.value = {};
        errmsg.value = "";

        $toast.success(`Removed ${props.rating}.`);
        router.push(`/@/users/${props.user}/ratings`);
        return;
    }

    $toast.error("Could not remove rating: HTTP Error.");
};

const productPage = () => router.push(`/@/products/${ratingData.value.productID}`);
onMounted(getRating);
</script>
