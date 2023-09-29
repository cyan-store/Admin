<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p class="text-center m-auto font-bold text-2xl" v-else-if="errmsg">{{ errmsg }}</p>
        <div v-else>
            <table class="table">
                <thead>
                    <th>User</th>
                    <th>Location</th>
                    <th>IP Address</th>
                    <th>Date</th>
                </thead>
                <tbody>
                    <tr v-for="log in logs" :key="log.id">
                        <td :title="log.id">{{ log.user }}</td>
                        <td>
                            <strong>[{{ log.method }}] </strong>
                            <span>{{ log.path }}</span>
                        </td>

                        <td>{{ log.ip }}</td>

                        <td :title="useUnix(log.date).format('dddd, MMMM Do YYYY, h:mm:ss a')">{{ log.from_now }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SystemLogs, SystemLogsData } from "@/types/types/system";
import { useAuthStore } from "@/stores/auth";
import { useUnix } from "@/use/useDate";
import { useRequest } from "@/use/useRequest";
import { onMounted, ref } from "vue";

const auth = useAuthStore();
const logs = ref<SystemLogsData[]>([]);

const loading = ref(false);
const errmsg = ref("");

const getLogs = async () => {
    const settingsData = await useRequest<SystemLogs>("/system/log", "GET", null, auth.token, loading);

    if (!settingsData.error && settingsData.data.status === 200) {
        logs.value = settingsData.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

onMounted(getLogs);
</script>
