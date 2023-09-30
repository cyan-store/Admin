<template>
    <div class="my-4">
        <img v-if="loading" class="animate-spin mx-auto" src="/svg/loading-spinner.svg" width="50" />
        <p class="text-center m-auto font-bold text-2xl" v-else-if="errmsg">{{ errmsg }}</p>
        <div v-else class="grid lg:grid-cols-4 grid-cols-2 grid-rows-1 gap-1 max-sm:hidden">
            <span v-for="(stat, n) in statsData" :key="stat" class="inline-block bg-primary p-4 text-base-200 font-bold rounded-md text-center">
                <h4 class="text-2xl">{{ stat || 0 }}</h4>
                <span class="capitalize">{{ n }}</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Stats, StatsData } from "@/types/types/stats";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { onMounted, ref } from "vue";

const auth = useAuthStore();

const loading = ref(false);
const errmsg = ref("");
const statsData = ref<Partial<StatsData>>({});

const getStats = async () => {
    const settingsData = await useRequest<Stats>("/recent", "GET", null, auth.token, loading);

    if (!settingsData.error && settingsData.data.status === 200) {
        statsData.value = settingsData.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

onMounted(getStats);
</script>
