<template>
    <tr>
        <td>
            <RouterLink :to="`/@/products/${data.productID}`">{{ data.productID }}</RouterLink>
        </td>

        <td>
            <RouterLink :to="`/@/users/${data.user}`">{{ data.user }}</RouterLink>
        </td>
        <td>{{ data.name }}</td>
        <!-- TODO: Use vue-stars -->
        <td>{{ data.rating }}*</td>

        <td :class="{ nodesc: !data?.description }">{{ review }}</td>
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

<style scoped>
.nodesc {
    color: red;
}
</style>
