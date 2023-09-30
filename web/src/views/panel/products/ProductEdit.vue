<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Edit Product Details</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Update/modify a product.</p>

        <ProductDetailEditControl :id="product" />
        <RouterLink class="btn btn-sm" :to="`/@/products/${product}`">Back to Details</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import ProductDetailEditControl from "@/components/products/edit/ProductDetailEditControl.vue";

const route = useRoute();
const product = String(route.params.id);
</script>
