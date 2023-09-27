<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Home</h2>
        <p class="text-sm font-bold opacity-60">The panel's homepage. Here you can find statistics, logs, and user information.</p>

        <div class="my-4">
            <StatsDisplay />
            <UserDisplay />
        </div>

        <SystemLoggingControl />
    </div>
</template>

<script lang="ts" setup>
import StatsDisplay from "@/components/index/StatsDisplay.vue";
import UserDisplay from "@/components/index/UserDisplay.vue";
import SystemLoggingControl from "@/components/system/SystemLoggingControl.vue";
</script>
