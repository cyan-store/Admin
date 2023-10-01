<template>
    <tr>
        <td>
            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/users/${$route.params.id}/ratings/${data.id}`">
                {{ data.id }}
            </RouterLink>
        </td>

        <td>{{ data.name }}</td>

        <td v-if="data.description">{{ data.description }}</td>
        <td v-else>
            <strong>No content provided.</strong>
        </td>

        <td>
            <StarRating :star-size="10" :rating="data.rating" :read-only="true" :show-rating="false" />
        </td>

        <td>
            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/products/${data.productID}`">
                {{ data.productID }}
            </RouterLink>
        </td>

        <td :title="useDate(data.createdAt)">{{ useNow(data.createdAt) }}</td>
        <td :title="useDate(data.updatedAt)">{{ useNow(data.updatedAt) }}</td>
        <td>
            <button class="btn btn-xs" @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { UserRatingData } from "@/types/types/ratings";
import { useDate, useNow } from "@/use/useDate";
import { useRoute, useRouter } from "vue-router";

import StarRating from "vue-star-rating";

const props = defineProps<{ data: UserRatingData }>();
const router = useRouter();
const route = useRoute();

const details = () => router.push(`/@/users/${route.params.id}/ratings/${props.data.id}`);
</script>
