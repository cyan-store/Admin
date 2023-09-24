<template>
    <p v-if="!hasToken">Token is required!</p>
    <div v-else>
        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg">
            <div>
                <img :src="user.picture" />
                <div>
                    <b>Email: </b>
                    <span>{{ user.email }}</span>

                    <span> - {{ user.email_verified ? "Verified" : "Unverified" }}</span>
                </div>

                <div>
                    <b>Name: </b>
                    <span>{{ user.name }}</span>
                    <span v-if="user.nickname"> - ({{ user.nickname }})</span>
                </div>

                <div>
                    <b>Locale: </b>
                    <span>{{ user.locale }}</span>
                </div>

                <div>
                    <b>Login Information: </b>
                    <ul>
                        <li>
                            <b>Last Seen: </b>
                            <span :title="useDate(user.last_login)">{{ useNow(user.last_login) }}</span>
                        </li>

                        <li>
                            <b>Login IP: </b>
                            <span>{{ user.last_ip }}</span>
                        </li>

                        <li>
                            <b>Login Count: </b>
                            <span>{{ user.logins_count }}</span>
                        </li>
                    </ul>
                </div>

                <div v-if="user.identities?.length">
                    <b>Identities: </b>

                    <table>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>User ID</th>
                                <th>Connection Type</th>
                                <th>Social?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <UserIdentityItem v-for="id in user.identities" :key="id.provider" :data="id" />
                        </tbody>
                    </table>
                </div>

                <div>
                    <b>Created/Updated: </b>
                    <span>{{ useDate(user.created_at) }} / {{ useDate(user.updated_at) }}</span>
                </div>
            </div>

            <div>
                <button @click="orders">{{ user.name }}'s Orders</button>
                <button @click="ratings">{{ user.name }}'s Ratings</button>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>
    </div>
</template>

<script lang="ts" setup>
import type { Auth0User, Auth0UserData } from "@/types/types/users";
import { useAuthStore } from "@/stores/auth";
import { useAuth0Store } from "@/stores/auth0";
import { useDate, useNow } from "@/use/useDate";
import { useRequest } from "@/use/useRequest";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import UserIdentityItem from "./UserIdentityItem.vue";

const auth0 = useAuth0Store();
const auth = useAuthStore();
const router = useRouter();

const user = ref<Partial<Auth0UserData>>({});
const loading = ref(false);
const errmsg = ref("");

const props = defineProps<{ id: string }>();
const hasToken = computed(() => auth0.hasToken());
const orders = () => router.push(`/@/users/${props.id}/orders`);
const ratings = () => router.push(`/@/users/${props.id}/ratings`);

const getUser = async () => {
    if (!hasToken.value) return;
    user.value = {};

    const tokens = new URLSearchParams({ token: auth0.token }).toString();
    const userDetails = await useRequest<Auth0User>(`/users/${props.id}?${tokens}`, "GET", null, auth.token, loading);

    if (!userDetails.error && userDetails.data.status === 200) {
        user.value = userDetails.json.data;
        errmsg.value = "";

        return;
    }

    if (userDetails.data.status === 404) {
        errmsg.value = "User not found!";

        return;
    }

    errmsg.value = "HTTP Error.";
};

onMounted(getUser);
watch(() => auth0.token, getUser);
</script>

<style scoped>
table {
    margin: 15px 0;
}
</style>
