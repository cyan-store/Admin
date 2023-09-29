<template>
    <tr>
        <td>
            <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                    <img :src="img" height="100" />
                </div>
            </div>
        </td>

        <td>
            <b>{{ data.title }}</b>
            <p>{{ data.subtitle }}</p>
        </td>

        <td>
            <span v-for="tag in tags" :key="tag" class="tag">
                {{ tag }}
            </span>
        </td>

        <td>${{ (data.price / 100).toFixed(2) }}</td>
        <td>{{ stock }}</td>

        <td :title="useDate(data.createdAt)">{{ useNow(data.createdAt) }}</td>
        <td :title="useDate(data.updatedAt)">{{ useNow(data.updatedAt) }}</td>

        <td>
            <button class="btn btn-xs" @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { ProductSearchDetail } from "@/types/types/products";
import { useDate, useNow } from "@/use/useDate";
import { useImage } from "@/use/useImage";
import { useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps<{ data: ProductSearchDetail }>();
const router = useRouter();

const tags = computed(() => props.data.tags.split(",").filter((n) => n.length !== 0));
const img = computed(() => useImage(props.data.images));
const stock = computed(() => {
    return {
        IN_STOCK: "In Stock",
        OUT_STOCK: "Out of Stock",
        DISCONTINUED: "Discontinued",
        HIDDEN: "Hidden",
    }[props.data.stock];
});

const details = () => router.push(`/@/products/${props.data.id}`);
</script>
