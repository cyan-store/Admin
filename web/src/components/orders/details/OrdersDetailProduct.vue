<template>
    <div>
        <div>
            <img :src="img" height="150" />

            <RouterLink :to="`/@/products/${data.info.id}`">{{ data.info.title }}</RouterLink>
            <b> x{{ data.amount }}</b>
        </div>

        <div>
            <b>Price: </b>
            <span>${{ (data.info.price / 100).toFixed(2) }}</span>
        </div>

        <div>
            <b>Stock Status: </b>
            <span>{{ data.info.stock }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { OrderProducts } from "@/types/types/orders";
import { useImage } from "@/use/useImage";
import { computed } from "vue";

const props = defineProps<{
    data: OrderProducts;
}>();

const img = computed(() => useImage(props.data.info.images));
</script>
