<template>
    <div>
        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>
        <div v-else>
            <span>
                <h4>{{ statsData?.products || 0 }}</h4>
                <p>Products</p>
            </span>

            <span>
                <h4>{{ statsData?.orders || 0 }}</h4>
                <p>Orders</p>
            </span>

            <span>
                <h4>{{ statsData?.ratings || 0 }}</h4>
                <p>Ratings</p>
            </span>

            <span>
                <h4>{{ statsData?.admins || 0 }}</h4>
                <p>Admins</p>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Stats, StatsData } from "@/types/types/recent";
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";
import { useRequest } from "@/use/useRequest";

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
