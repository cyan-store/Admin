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

        <!-- TODO: Proper dates -->
        <td>{{ data.createdAt }}</td>
        <td>{{ data.updatedAt }}</td>
        <td>
            <button @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { RecentRatingsData } from "@/types/types/recent";
import { computed } from "vue";
import { useRouter } from "vue-router";

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
