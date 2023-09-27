<template>
    <div class="bg-base-200 rounded-md sm:text-center p-4 grid grid-cols-3 max-sm:grid-cols-1 grid-rows-1 gap-1">
        <span>
            <span class="font-bold">ID: </span>
            <span>{{ auth.userData.id }}</span>
        </span>
        <span>
            <span class="font-bold">Email: </span>
            <span>{{ auth.userData.email }}</span>
        </span>
        <span>
            <span class="font-bold">Expire: </span>
            <span>{{ useUnix(auth.userData.expire).fromNow() }}</span>
        </span>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useUnix } from "@/use/useDate";

const auth = useAuthStore();
</script>
