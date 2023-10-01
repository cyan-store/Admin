<template>
    <tr>
        <td>
            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/products/${data.productID}`">{{ data.productID }}</RouterLink>
        </td>

        <td>
            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/users/${data.user}`">{{ data.user }}</RouterLink>
        </td>

        <td>{{ data.name }}</td>

        <td>
            <StarRating :star-size="10" :rating="data.rating" :read-only="true" :show-rating="false" />
        </td>

        <td :class="{ 'font-bold': !data?.description }">{{ review }}</td>
        <td :title="useDate(data.createdAt)">{{ useNow(data.createdAt) }}</td>
        <td :title="useDate(data.updatedAt)">{{ useNow(data.updatedAt) }}</td>

        <td>
            <button class="btn btn-primary btn-xs" @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { RecentRatingsData } from "@/types/types/recent";
import { useDate, useNow } from "@/use/useDate";
import { useRouter } from "vue-router";
import { computed } from "vue";

import StarRating from "vue-star-rating";

const router = useRouter();
const props = defineProps<{
    data: RecentRatingsData;
}>();

const review = computed(() => {
    return props.data?.description || "No data provided";
});

const details = () => {
    router.push(`/@/users/${props.data.user}/ratings/${props.data.id}`);
};
</script>
