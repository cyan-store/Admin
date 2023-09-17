<template>
    <div>
        <h2>Users Listing</h2>

        <Auth0TokenManager />
        <UserListingControl />
    </div>
</template>

<script lang="ts" setup>
import Auth0TokenManager from "@/components/general/Auth0TokenManager.vue";
import UserListingControl from "@/components/users/UserListingControl.vue";
</script>
