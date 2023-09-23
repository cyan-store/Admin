<template>
    <tr>
        <td>
            <RouterLink :to="`/@/users/${$route.params.id}/ratings/${data.id}`">{{ data.id }}</RouterLink>
        </td>

        <td>{{ data.name }}</td>

        <td v-if="data.description">{{ data.description }}</td>
        <td v-else><b>No content provided.</b></td>

        <!-- TODO: vue-stars -->
        <td>{{ data.rating }}</td>
        <td>
            <RouterLink :to="`/@/products/${data.productID}`">{{ data.productID }}</RouterLink>
        </td>

        <!-- TODO: Proper dates -->
        <td>{{ data.createdAt }}</td>
        <td>{{ data.updatedAt }}</td>
        <td>
            <button @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { UserRatingData } from "@/types/types/ratings";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{ data: UserRatingData }>();
const router = useRouter();
const route = useRoute();

const details = () => router.push(`/@/users/${route.params.id}/ratings/${props.data.id}`);
</script>
