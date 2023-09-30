<template>
    <teleport to="#popup">
        <dialog class="modal" :open="props.open">
            <div class="modal-box">
                <slot />

                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn" @click="emits('exit')">Close</button>
                    </form>
                </div>
            </div>

            <div class="modal-backdrop">
                <button @click="emits('exit')">X</button>
            </div>
        </dialog>
    </teleport>
</template>

<script lang="ts" setup>
const emits = defineEmits<{ (e: "exit"): void }>();
const props = defineProps<{ open: boolean }>();
</script>
