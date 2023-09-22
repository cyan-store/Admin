<template>
    <div>
        <h2>New Product</h2>

        <ProductDetailEditControl id="" />
        <RouterLink to="/@/products">Back to Listing</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import ProductDetailEditControl from "@/components/products/edit/ProductDetailEditControl.vue";
</script>
