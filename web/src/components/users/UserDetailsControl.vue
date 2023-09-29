<template>
    <p v-if="!hasToken" class="font-bold my-2">Token is required!</p>
    <img v-else-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
    <p v-else-if="errmsg" class="font-bold my-4 text-center">{{ errmsg }}</p>
    <div v-else class="my-4 md:text-center">
        <hr class="my-4" />

        <div class="md:inline-block md:bg-base-200 md:p-4 rounded-md">
            <div class="avatar max-md:w-[100vw] max-md:block">
                <div class="mask mx-auto mask-squircle w-[100px] h-[100px]">
                    <img :src="user.picture" />
                </div>
            </div>

            <hr class="my-4" />

            <div class="text-left leading-[1.8rem]">
                <div>
                    <strong>Email: </strong>
                    <span>{{ user.email }}</span>
                    <span> - {{ user.email_verified ? "Verified" : "Unverified" }}</span>
                </div>

                <div>
                    <strong>Name: </strong>
                    <span>{{ user.name }}</span>
                    <span v-if="user.nickname"> - ({{ user.nickname }})</span>
                </div>

                <div>
                    <strong>Locale: </strong>
                    <span>{{ user.locale }}</span>
                </div>

                <div>
                    <strong>Last Seen: </strong>
                    <span :title="useDate(user.last_login)">{{ useNow(user.last_login) }}</span>
                </div>

                <div>
                    <strong>Login IP: </strong>
                    <span>{{ user.last_ip }}</span>
                </div>

                <div>
                    <strong>Login Count: </strong>
                    <span>{{ user.logins_count }}</span>
                </div>

                <div>
                    <strong>Created: </strong>
                    <span>{{ useDate(user.created_at) }}</span>
                </div>

                <div>
                    <strong>Updated: </strong>
                    <span>{{ useDate(user.updated_at) }}</span>
                </div>
            </div>
        </div>

        <div class="my-4">
            <button class="btn btn-sm btn-primary max-md:w-[calc(100vw-1rem)] max-md:my-2 md:mr-2" @click="orders">{{ user.name }}'s Orders</button>
            <button class="btn btn-sm btn-secondary max-md:w-[calc(100vw-1rem)]" @click="ratings">{{ user.name }}'s Ratings</button>
        </div>

        <div v-if="user.identities?.length" class="text-left">
            <hr class="my-8" />
            <h4 class="block font-bold">Identities:</h4>

            <table class="table">
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
