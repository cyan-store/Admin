<template>
    <div>
        <h2>Login</h2>
        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>

        <div>
            <input :disabled="loading" type="text" :class="{ invalid: invalidEmail }" v-model="email" placeholder="Email" />
            <input :disabled="loading" type="password" :class="{ invalid: invalidPassword }" v-model="password" placeholder="Password" />

            <p v-if="invalidEmail">Invalid email!</p>
            <p v-if="invalidPassword">Invalid Password!</p>

            <br />

            <button :disabled="!valid" @click="login">Login</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";

import Joi from "joi";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const errmsg = ref("");
const loading = ref(false);

interface Login {
    statusCode: number;
    data: {
        token: string;
    };

    message: string;
}

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

<style scoped>
.invalid {
    border: 1px solid red;
}
</style>
