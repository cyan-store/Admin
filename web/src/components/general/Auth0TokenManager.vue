<template>
    <div>
        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>

        <div>
            <input type="text" :value="token" placeholder="Request auth0 token..." readonly />

            <button :disabled="loading" @click="getToken">Request Token</button>
            <button :disabled="loading" @click="removeToken">Remove Token</button>
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
