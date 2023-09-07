<template>
    <div>
        <h1>About</h1>
        <pre>{{ auth.userData }}</pre>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>
