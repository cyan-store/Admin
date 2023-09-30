<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Product Details</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Information relating to a product.</p>

        <ProductDetailItem :id="product" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import ProductDetailItem from "@/components/products/details/ProductDetailItem.vue";

const route = useRoute();
const product = String(route.params.id);
</script>
