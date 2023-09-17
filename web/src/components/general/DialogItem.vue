<template>
    <teleport to="#popup">
        <dialog :open="props.open">
            <button @click="emits('exit')">Close</button>

            <slot />
        </dialog>
    </teleport>
</template>

<script lang="ts" setup>
const emits = defineEmits<{ (e: "exit"): void }>();
const props = defineProps<{ open: boolean }>()
</script>
