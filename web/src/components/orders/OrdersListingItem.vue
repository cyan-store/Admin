<template>
    <tr>
        <td>
            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/users/${$route.params.id}/orders/${data.id}`">{{ data.id }}</RouterLink>
        </td>

        <td>
            <details class="dropdown">
                <summary class="m-1 btn btn-xs">Expand</summary>
                <ul class="menu dropdown-content z-[1] bg-base-200 rounded-box">
                    <li v-for="product in productList" :key="product">
                        <span>
                            <RouterLink class="text-info hover:opacity-60 font-bold" :to="`/@/products/${product}`">{{ product }}</RouterLink>
                            <strong> x{{ quantityList[productList.indexOf(product)] }}</strong>
                        </span>
                    </li>
                </ul>
            </details>
        </td>

        <td>{{ data.status }}</td>
        <td>${{ (data.amount / 100).toFixed(2) }}</td>
        <td>{{ data.country }}</td>
        <td>{{ data.postal }}</td>
        <td>{{ data.shipping }}</td>

        <td :title="useDate(data.createdAt)">{{ useNow(data.createdAt) }}</td>
        <td :title="useDate(data.updatedAt)">{{ useNow(data.updatedAt) }}</td>
        <td>
            <button class="btn btn-xs" @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { UserOrderData } from "@/types/types/orders";
import { useDate, useNow } from "@/use/useDate";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{ data: UserOrderData }>();
const router = useRouter();
const route = useRoute();

const productList = props.data.productID.split(",");
const quantityList = props.data.quantity.split(",");

const details = () => router.push(`/@/users/${route.params.id}/orders/${props.data.id}`);
</script>
