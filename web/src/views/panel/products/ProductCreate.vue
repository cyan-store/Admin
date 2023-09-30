<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">New Product</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Create a new product.</p>

        <ProductDetailEditControl id="" />
        <RouterLink class="btn btn-sm" to="/@/products">Back to Listing</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import ProductDetailEditControl from "@/components/products/edit/ProductDetailEditControl.vue";
</script>
