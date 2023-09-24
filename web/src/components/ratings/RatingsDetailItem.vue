<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg">
            <div>
                <b>Display Name: </b>
                <span>{{ ratingData.name }}</span>
            </div>

            <div>
                <b>Rating: </b>

                <!-- TODO: vue-stars -->
                <span>{{ ratingData.rating }}*</span>
            </div>

            <div>
                <b>Description: </b>
                <textarea v-if="ratingData.description" :value="ratingData.description" readonly></textarea>
                <span v-else>No content provided.</span>
            </div>

            <div>
                <b>Created: </b>
                <span>{{ ratingData.createdAt }}</span>
            </div>

            <div>
                <b>Updated: </b>
                <span>{{ ratingData.updatedAt }}</span>
            </div>

            <div>
                <button @click="productPage">Product Page</button>
                <button @click="deleteRating">Delete Rating</button>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>

        <RouterLink :to="`/@/users/${props.user}/ratings`">Back to Ratings</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import type { UserRating, UserRatingData } from "@/types/types/ratings";
import type { Response } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

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
