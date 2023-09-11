<template>
    <tr>
        <td>{{ data.userID }}</td>
        <td>{{ data.transactionID }}</td>
        <td>{{ products }}</td>
        <td>{{ data.quantity.split(",").join(", ") }}</td>
        <td>${{ (data.amount / 100).toFixed(2) }}</td>
        <td>{{ data.email }}</td>
        <td>{{ data.status }}</td>
        <td>{{ data.shipping }}</td>

        <!-- TODO: Proper dates -->
        <td>{{ data.createdAt }}</td>
        <td>{{ data.updatedAt }}</td>
        <td>
            <button @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { RecentOrdersData } from "@/types/types/recent";
import { computed } from "vue";
import { useRouter } from "vue-router";

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
