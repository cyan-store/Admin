<template>
    <tr>
        <td>
            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/users/${data.userID}`">{{ data.userID }}</RouterLink>
        </td>
        <td>{{ data.transactionID }}</td>
        <td>{{ products }}</td>
        <td>{{ data.quantity.split(",").join(", ") }}</td>
        <td>${{ (data.amount / 100).toFixed(2) }}</td>
        <td>{{ data.email }}</td>
        <td>{{ data.status }}</td>
        <td>{{ data.shipping }}</td>

        <td :title="useDate(data.createdAt)">{{ useNow(data.createdAt) }}</td>
        <td :title="useDate(data.updatedAt)">{{ useNow(data.updatedAt) }}</td>
        <td>
            <button class="btn btn-primary btn-xs" @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { RecentOrdersData } from "@/types/types/recent";
import { useDate, useNow } from "@/use/useDate";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const props = defineProps<{
    data: RecentOrdersData;
}>();

const products = computed(() => {
    const products = props.data.productID.split(",");

    if (products.length > 1) {
        return products[0] + "...";
    }

    return products[0];
});

const details = () => {
    router.push(`/@/users/${props.data.userID}/orders/${props.data.id}`);
};
</script>
