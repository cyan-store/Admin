<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Products Listing</h2>
        <p class="text-sm font-bold opacity-60 mb-4">A list of products.</p>

        <ProductListingControl />
    </div>
</template>

<script lang="ts" setup>
import ProductListingControl from "@/components/products/ProductListingControl.vue";
</script>
