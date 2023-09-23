<template>
    <div>
        <h2>System Settings</h2>

        <UserDisplay />

        <div>
            <button @click="cfg = 'Config'" :disabled="isConfig">Config</button>
            <button @click="cfg = 'Logs'" :disabled="!isConfig">Logs</button>

            <div>
                <SystemConfigControl v-if="isConfig" />
                <SystemLoggingControl v-else />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import UserDisplay from "@/components/system/UserDisplay.vue";
import SystemConfigControl from "@/components/system/SystemConfigControl.vue";
import SystemLoggingControl from "@/components/system/SystemLoggingControl.vue";

const cfg = ref("Config");
const isConfig = computed(() => cfg.value === "Config");
</script>
