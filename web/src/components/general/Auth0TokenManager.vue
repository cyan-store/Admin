<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <div v-else-if="errmsg" class="font-bold my-4">
            <span>Could not get token: </span>
            <span class="text-error">{{ errmsg }}</span>
        </div>
        <div v-else>
            <input
                type="text"
                class="input input-bordered input-sm max-md:w-[calc(100vw-1rem)]"
                :value="token"
                placeholder="Request auth0 token..."
                readonly
            />

            <button
                class="btn btn-success text-base-200 btn-sm max-md:block max-md:w-[calc(100vw-1rem)] max-md:my-2 md:mx-2"
                :disabled="loading"
                @click="getToken"
            >
                Fetch
            </button>
            <button
                class="btn btn-error text-base-200 btn-sm max-md:w-[calc(100vw-1rem)]"
                :disabled="loading || auth0.token === ''"
                @click="removeToken"
            >
                Remove
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuth0Store } from "@/stores/auth0";
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";

const auth0 = useAuth0Store();
const auth = useAuthStore();

const loading = ref(false);
const errmsg = ref("");

const getToken = async () => {
    const err = await auth0.getToken(auth.token, loading);

    if (!err) {
        errmsg.value = "HTTP Error.";
        return;
    }

    errmsg.value = "";
};

const removeToken = () => auth0.removeToken();
const token = computed(() => auth0.token);
</script>
