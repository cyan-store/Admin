<template>
    <div>
        <h2>Order Details</h2>

        <pre>{{ route.params?.id }}</pre>
        <pre>{{ route.params?.order }}</pre>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
