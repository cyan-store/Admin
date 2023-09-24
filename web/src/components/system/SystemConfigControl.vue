<template>
    <div>
        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>
        <div v-else>
            <div>
                <h4>Currency</h4>
                <p v-if="invalidInput('currency')">Invalid currency.</p>

                <input type="text" v-model="settingsDetails.currency" />
            </div>

            <div>
                <h4>Allowed Shipping Country</h4>
                <p v-if="invalidInput('shipping')">Invalid shipping.</p>

                <input type="text" v-model="settingsDetails.shipping" />
            </div>

            <div>
                <h4>Shipping Cost</h4>
                <p v-if="invalidInput('shippingCost')">Invalid shipping cost.</p>

                <input type="number" v-model="settingsDetails.shippingCost" />
            </div>

            <div>
                <h4>Allow Purchases?</h4>

                <select v-model="settingsDetails.purchase">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div>
                <h4>Allow User Ratings?</h4>

                <select v-model="settingsDetails.ratings">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <button :disabled="isInvalidConfig || noneChanged" @click="updateSettings">Update</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SystemSettings, SystemSettingsData } from "@/types/types/system";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useToast } from "vue-toast-notification";
import { computed, onMounted, reactive, ref } from "vue";
import Joi from "joi";

const auth = useAuthStore();
const $toast = useToast();

const settings = ref<Partial<SystemSettingsData>>({});
const loading = ref(false);
const errmsg = ref("");

const settingsDetails = reactive({
    currency: "",
    shipping: "",
    shippingCost: 0,
    purchase: "true",
    ratings: "true",
});

const valid = {
    currency: Joi.string().min(3).required(),
    shipping: Joi.string().min(2).required(),
    shippingCost: Joi.number().required(),
};

const getSettings = async () => {
    const settingsData = await useRequest<SystemSettings>("/system", "GET", null, auth.token, loading);

    if (!settingsData.error && settingsData.data.status === 200) {
        setDetails(settingsData.json.data);
        settings.value = settingsData.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const updateSettings = async () => {
    const data = {
        currency: settingsDetails.currency,
        shipping: settingsDetails.shipping,
        shippingCost: settingsDetails.shippingCost,
        purchase: settingsDetails.purchase === "true",
        ratings: settingsDetails.ratings === "true",
    };

    const settingsData = await useRequest<SystemSettings>("/system", "POST", data, auth.token, loading);

    if (!settingsData.error && settingsData.data.status === 200) {
        errmsg.value = "";
        getSettings();

        $toast.success("Updated settings.");
        return;
    }

    $toast.error("Could not update settings: HTTP Error.");
    errmsg.value = "HTTP Error.";
};

const setDetails = (details: SystemSettingsData) => {
    settingsDetails.currency = details.currency;
    settingsDetails.shipping = details.shipping;
    settingsDetails.shippingCost = details.shippingCost;
    settingsDetails.purchase = String(details.purchase);
    settingsDetails.ratings = String(details.ratings);
};

const invalidInput = (option: keyof typeof valid) => {
    const { error } = valid[option].validate(settingsDetails[option]);

    return error;
};

const isInvalidConfig = computed(() => {
    if (loading.value || errmsg.value) return true;

    for (const k in valid) {
        const data = String(settingsDetails[k as keyof typeof settingsDetails]);
        const { error } = valid[k as keyof typeof valid].validate(data);

        if (error) return true;
    }

    return false;
});

const noneChanged = computed(() => {
    if (!settingsDetails.currency || !settings.value.currency) return false;

    for (const k in settingsDetails) {
        let detail: string | number | boolean = settingsDetails[k as keyof typeof settingsDetails];

        if (detail === "true" || detail === "false") detail = detail === "true";
        if (detail !== settings.value[k as keyof typeof settings.value]) {
            return false;
        }
    }

    return true;
});

onMounted(getSettings);
</script>
