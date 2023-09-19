<template>
    <tr>
        <td>
            <img :src="img" height="100" />
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
        <td>{{ data.stock }}</td>

        <!-- TODO: Proper dates -->
        <td>{{ data.createdAt }}</td>
        <td>{{ data.updatedAt }}</td>

        <td>
            <button @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { ProductSearchDetail } from "@/types/types/products";
import { useImage } from "@/use/useImage";
import { useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps<{ data: ProductSearchDetail }>();
const router = useRouter();

const tags = computed(() => props.data.tags.split(",").filter((n) => n.length !== 0));
const img = computed(() => useImage(props.data.images));
const details = () => router.push(`/@/products/${props.data.id}`);
</script>

<style scoped>
.tag {
    background-color: purple;
    border-radius: 15px;
    padding: 10px;
    margin: 0 5px;
    color: #fff;
}
</style>
