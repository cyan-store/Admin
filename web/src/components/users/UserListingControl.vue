<template>
    <div>
        <p v-if="!hasToken">Token is required!</p>
        <div v-else>
            <p v-if="loading">Loading...</p>

            <table v-if="!errmsg">
                <thead>
                    <tr>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Verified</th>
                        <th>ID</th>
                        <th>Login Amount</th>
                        <th>Last Seen</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <p v-if="!users.length && !loading">Nothing found!</p>
                    <UserListingItem v-for="user in users" :key="user.user_id" :data="user" />
                </tbody>
            </table>
            <p v-else>{{ errmsg }}</p>
        </div>

        <PaginateItem :page="page" :disabled="!hasToken" @clicked="update" />
    </div>
</template>

<script lang="ts" setup>
import type { Auth0Users, Auth0UserData } from "@/types/types/users";
import { useAuth0Store } from "@/stores/auth0";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { computed, onMounted, ref, watch } from "vue";

import PaginateItem from "@/components/general/PaginateItem.vue";
import UserListingItem from "./UserListingItem.vue";

const auth0 = useAuth0Store();
const auth = useAuthStore();

const users = ref<Auth0UserData[]>([]);
const page = ref(0);
const loading = ref(false);
const errmsg = ref("");

const hasToken = computed(() => auth0.hasToken());
const update = (n: number) => (page.value = n);

const getUsers = async () => {
    if (!hasToken.value) return;
    users.value.length = 0;

    const tokens = new URLSearchParams({ token: auth0.token, page: String(page.value) }).toString();
    const userListing = await useRequest<Auth0Users>(`/users?${tokens}`, "GET", null, auth.token, loading);

    if (!userListing.error && userListing.data.status === 200) {
        users.value = userListing.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

onMounted(getUsers);
watch(page, getUsers);
watch(() => auth0.token, getUsers);
</script>
