<template>
    <div class="flex my-4 max-md:max-w-[350px] md:mx-auto">
        <div class="avatar mr-2">
            <div class="w-24 rounded-xl">
                <img :src="img" height="150" />
            </div>
        </div>

        <div>
            <div>
                <RouterLink class="link text-info no-underline hover:underline font-bold text-xl" :to="`/@/products/${data.info.id}`">
                    {{ data.info.title }}
                </RouterLink>

                <strong> x{{ data.amount }}</strong>
            </div>

            <div>
                <strong>Price: </strong>
                <span>${{ (data.info.price / 100).toFixed(2) }}</span>
            </div>

            <div>
                <strong>Stock Status: </strong>
                <span>{{ stock }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { OrderProducts } from "@/types/types/orders";
import { useStock } from "@/use/useDatabase";
import { useImage } from "@/use/useImage";
import { computed } from "vue";

const props = defineProps<{
    data: OrderProducts;
}>();

const img = computed(() => useImage(props.data.info.images));
const stock = computed(() => useStock(props.data.info.stock));
</script>
