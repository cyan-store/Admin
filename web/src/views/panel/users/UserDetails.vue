<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Users Details</h2>
        <p class="text-sm font-bold opacity-60 mb-4">User details, orders, and ratings.</p>

        <Auth0TokenManager />
        <UserDetailsControl :id="user" />
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

import Auth0TokenManager from "@/components/general/Auth0TokenManager.vue";
import UserDetailsControl from "@/components/users/UserDetailsControl.vue";

const route = useRoute();
const user = String(route.params.id);
</script>
