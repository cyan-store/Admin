<template>
    <div class="text-center">
        <div class="bg-base-200 p-4 rounded-md inline-block max-sm:w-full max-sm:h-[100vh]">
            <h2 class="text-4xl my-4 font-bold" :class="{ 'mb-8': !errmsg }">Login</h2>
            <LoadingAuthItem :loading="loading" />
            <p v-if="errmsg" class="my-4 text-sm italic">{{ errmsg }}</p>

            <div class="sm:px-10 px-2">
                <input class="input input-bordered block max-sm:w-full" :disabled="loading" type="text" :class="{ 'input-secondary': invalidEmail }" v-model="email" placeholder="Email" />
                <input class="input input-bordered block max-sm:w-full my-2" :disabled="loading" type="password" :class="{ 'input-secondary': invalidPassword }" v-model="password" placeholder="Password" />

                <div>
                    <p v-if="invalidEmail" class="my-4 text-sm italic">Invalid email!</p>
                    <p v-if="invalidPassword" class="my-4 text-sm italic">Invalid Password!</p>
                </div>

                <button class="btn btn-primary my-5 w-full" :disabled="!valid" @click="login">Submit</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Login } from "@/types/types/auth";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import Joi from "joi";

import LoadingAuthItem from "@/components/loading/LoadingAuthItem.vue";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const errmsg = ref("");
const loading = ref(false);

const login = async () => {
    const user = await useRequest<Login>(
        "/auth/login",
        "POST",
        {
            email: email.value,
            password: password.value,
        },

        "",
        loading,
    );

    if (user.error) return;
    if (user.data.status !== 200) {
        errmsg.value = user.json.message;

        return;
    }

    await auth.login(user.json.data.token);
    router.push("/@");
};

const invalidEmail = computed(() => {
    const emailValid = Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "ca"] },
        })
        .required();

    const { error } = emailValid.validate(email.value);

    if (error) {
        return email.value.length > 0;
    }

    return !!error;
});

const invalidPassword = computed(() => {
    const passwordValid = Joi.string().min(5).max(20);
    const { error } = passwordValid.validate(password.value);

    if (error) {
        return password.value.length > 0;
    }

    return !!error;
});

const valid = computed(() => {
    return !invalidEmail.value && !invalidPassword.value && email.value.length > 0 && password.value.length > 0 && !errmsg.value;
});

watch(email, () => (errmsg.value = ""));
watch(password, () => (errmsg.value = ""));
</script>
