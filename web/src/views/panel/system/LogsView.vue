<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">Audit Log</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Chronological record of system activities.</p>

        <SystemLoggingControl />
    </div>
</template>

<script lang="ts" setup>
import SystemLoggingControl from "@/components/system/SystemLoggingControl.vue";
</script>
