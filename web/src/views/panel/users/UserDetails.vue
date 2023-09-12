<template>
    <div>
        <h2>User Details</h2>

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
