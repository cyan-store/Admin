<template>
    <div>
        <button class="btn btn-primary font-bold min-h-[1.5rem] h-[1.5rem] px-[0.5rem]" @click="updatePage(-1)" :disabled="disabled || page <= 0">
            &lt;
        </button>

        <span class="text-lg font-bold mx-2 select-none">{{ page + 1 }}</span>

        <button class="btn btn-primary font-bold min-h-[1.5rem] h-[1.5rem] px-[0.5rem]" @click="updatePage(1)" :disabled="disabled || page >= 200">
            &gt;
        </button>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    page: number;
    disabled: boolean;
}>();

const emits = defineEmits<{
    (e: "clicked", evt: number): void;
}>();

const updatePage = (n: number) => {
    if (props.page + n < 0) {
        return;
    }

    emits("clicked", props.page + n);
};
</script>
