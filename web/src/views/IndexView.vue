<template>
    <!-- Empty redirect to login -->
    <div></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
    if (!auth.authorized) {
        router.push("/login");
    }
});
</script>
