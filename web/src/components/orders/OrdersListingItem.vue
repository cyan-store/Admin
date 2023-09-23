<template>
    <tr>
        <td>
            <RouterLink :to="`/@/users/${$route.params.id}/orders/${data.id}`">{{ data.id }}</RouterLink>
        </td>

        <td>
            <ul>
                <li v-for="product in productList" :key="product">
                    <RouterLink :to="`/@/products/${product}`">{{ product }}</RouterLink>
                    <b> x{{ quantityList[productList.indexOf(product)] }}</b>
                </li>
            </ul>
        </td>

        <td>{{ data.status }}</td>
        <td>${{ (data.amount / 100).toFixed(2) }}</td>
        <td>{{ data.country }}</td>
        <td>{{ data.postal }}</td>
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
import type { UserOrderData } from "@/types/types/orders";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{ data: UserOrderData }>();
const router = useRouter();
const route = useRoute();

const productList = props.data.productID.split(",");
const quantityList = props.data.quantity.split(",");

const details = () => router.push(`/@/users/${route.params.id}/orders/${props.data.id}`);
</script>
