<template>
    <div>
        <h2>Product Edit</h2>

        <ProductDetailEditControl :id="product" />
        <RouterLink :to="`/@/products/${product}`">Back to Details</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import ProductDetailEditControl from "@/components/products/edit/ProductDetailEditControl.vue";

const route = useRoute();
const product = String(route.params.id);
</script>
