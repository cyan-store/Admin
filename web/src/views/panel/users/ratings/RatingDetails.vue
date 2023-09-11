<template>
    <div>
        <h2>Rating Details</h2>

        <pre>{{ route.params?.id }}</pre>
        <pre>{{ route.params?.rating }}</pre>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>
