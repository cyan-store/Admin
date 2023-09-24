<template>
    <div>
        <h2>User Information</h2>
        <div>
            <h4>{{ auth.userData.name }}</h4>
            <p><b>ID:</b> {{ auth.userData.id }}</p>
            <p><b>Email:</b> {{ auth.userData.email }}</p>
            <p><b>Expire:</b> {{ useUnix(auth.userData.expire).fromNow() }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useUnix } from "@/use/useDate";

const auth = useAuthStore();
</script>
