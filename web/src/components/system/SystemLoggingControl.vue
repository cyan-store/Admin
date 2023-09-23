<template>
    <div>
        <p v-if="loading">Loading...</p>
        <p v-if="errmsg">{{ errmsg }}</p>
        <div v-else>
            <table>
                <thead>
                    <th>User</th>
                    <th>Location</th>
                    <th>IP Address</th>
                    <th>Date</th>
                </thead>
                <tbody>
                    <tr v-for="log in logs" :key="log.id">
                        <td>{{ log.user }}</td>
                        <td>
                            <b>[{{ log.method }}] </b>
                            <span>{{ log.path }}</span>
                        </td>

                        <td>{{ log.ip }}</td>

                        <!-- TODO: Proper dates -->
                        <td>{{ log.from_now }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SystemLogs, SystemLogsData } from "@/types/types/system";
import { useAuthStore } from "@/stores/auth";
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
