<template>
    <div>
        <h2 class="text-3xl font-bold mb-2">System Settings</h2>
        <p class="text-sm font-bold opacity-60 mb-4">Global configurations used across the website and panel.</p>

        <SystemConfigControl />
    </div>
</template>

<script lang="ts" setup>
import SystemConfigControl from "@/components/system/SystemConfigControl.vue";
</script>
