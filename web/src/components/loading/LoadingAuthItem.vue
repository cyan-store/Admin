<template>
    <teleport to="#popup">
        <div v-if="loading" class="modal-background"></div>
        <dialog class="modal w-full" :class="{ 'modal-open': loading }">
            <img class="animate-spin" src="/svg/loading-spinner.svg" width="100" />
        </dialog>
    </teleport>
</template>

<script lang="ts" setup>
defineProps<{ loading: boolean }>();
</script>
