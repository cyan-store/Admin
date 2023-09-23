<template>
    <div>
        <h2>User Information</h2>
        <div>
            <h4>{{ auth.userData.name }}</h4>
            <p><b>ID:</b> {{ auth.userData.id }}</p>
            <p><b>Email:</b> {{ auth.userData.email }}</p>

            <!-- TODO: Proper dates -->
            <p><b>Expire:</b> {{ auth.userData.expire }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>
