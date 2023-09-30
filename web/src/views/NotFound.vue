<template>
    <!-- Empty redirect to login -->
    <div v-if="!auth.authorized"></div>
    <div v-else class="my-[10rem] text-center">
        <h4 class="font-bold text-2xl">Page not found!</h4>
        <RouterLink class="btn mt-8 btn-primary max-md:w-full" to="/">Go Home</RouterLink>
    </div>
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
