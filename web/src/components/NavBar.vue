<template>
    <nav>
        <RouterLink to="/@">Home</RouterLink>
        <RouterLink to="/@/about">About</RouterLink>
        <div v-if="!auth.authorized">
            <RouterLink to="/login">Login</RouterLink>
        </div>
        <div v-else>
            <a @click="logout">Logout</a>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";

const auth = useAuthStore();
const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
        auth.logout();
    }
};
</script>
