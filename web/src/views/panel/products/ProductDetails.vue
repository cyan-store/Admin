<template>
    <div>
        <h2>Product Details</h2>

        <ProductDetailItem :id="product" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import ProductDetailItem from "@/components/products/details/ProductDetailItem.vue";

const route = useRoute();
const product = String(route.params.id);
</script>
