<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <div class="text-center font-bold bg-base-200 rounded-md py-[10rem]" v-else-if="errmsg">
            <span class="text-2xl block mb-4">Request Error!</span>
            <span class="text-error">{{ errmsg }}</span>
        </div>
        <div v-else class="max-md:p-2">
            <div>
                <h4 class="font-bold text-lg">Currency</h4>
                <p class="text-sm opacity-60 mb-2">
                    Currency listed on products. This does not affect the cost of products. Ensure products are listed at a proper price before
                    changing.
                </p>
                <p v-if="invalidInput('currency')" class="my-4 text-error italic font-bold">Invalid currency.</p>

                <input
                    type="text"
                    class="input input-bordered max-md:w-full max-md:mb-4"
                    :class="{ 'input-error': invalidInput('currency') }"
                    v-model="settingsDetails.currency"
                />
            </div>

            <div class="mt-2">
                <h4 class="font-bold text-lg">Allowed Shipping Country</h4>
                <p class="text-sm opacity-60 mb-2">Allows shipping to one country.</p>
                <p v-if="invalidInput('shipping')" class="my-4 text-error italic font-bold">Invalid shipping.</p>

                <input
                    type="text"
                    class="input input-bordered max-md:w-full max-md:mb-4"
                    :class="{ 'input-error': invalidInput('shipping') }"
                    v-model="settingsDetails.shipping"
                />
            </div>

            <div class="mt-2">
                <h4 class="font-bold text-lg">Shipping Cost</h4>
                <p class="text-sm opacity-60 mb-2">Default cost of shipping.</p>
                <p v-if="invalidInput('shippingCost')" class="my-4 text-error italic font-bold">Invalid shipping cost.</p>

                <input
                    type="number"
                    class="input input-bordered max-md:w-full max-md:mb-4"
                    :class="{ 'input-error': invalidInput('shippingCost') }"
                    v-model="settingsDetails.shippingCost"
                />
            </div>

            <div class="mt-2">
                <h4 class="font-bold text-lg">Allow Purchases?</h4>
                <p class="text-sm opacity-60 mb-2">Enable/disable purchases on website.</p>

                <select class="select select-bordered max-md:w-full max-md:mb-4 min-w-[240px]" v-model="settingsDetails.purchase">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div class="mt-2">
                <h4 class="font-bold text-lg">Allow User Ratings?</h4>
                <p class="text-sm opacity-60 mb-2">Enable/disable ratings/reviews on website.</p>

                <select class="select select-bordered max-md:w-full max-md:mb-4 min-w-[240px]" v-model="settingsDetails.ratings">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <button class="btn btn-primary mt-4 max-md:w-full" :disabled="isInvalidConfig || noneChanged" @click="updateSettings">Update</button>
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
