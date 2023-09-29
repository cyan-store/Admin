<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Users Listing</h2>
        <p class="text-sm font-bold opacity-60 mb-4">A list of users. Requires a token to fetch.</p>

        <Auth0TokenManager />
        <UserListingControl />
    </div>
</template>

<script lang="ts" setup>
import Auth0TokenManager from "@/components/general/Auth0TokenManager.vue";
import UserListingControl from "@/components/users/UserListingControl.vue";
</script>
