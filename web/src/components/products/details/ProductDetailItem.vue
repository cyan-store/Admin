<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p v-else-if="errmsg" class="font-bold my-[10rem] text-center">{{ errmsg }}</p>
        <div v-else-if="!errmsg && productData">
            <h4 class="text-xl font-bold">{{ productData.title }}</h4>
            <p class="text-sm opacity-60">{{ productData.subtitle }}</p>

            <div class="my-4">
                <p class="mb-4">{{ productData.description }}</p>

                <ul v-if="tags?.length">
                    <li v-for="tag in tags" :key="tag" class="btn btn-sm btn-primary mr-1 mb-1">#{{ tag }}</li>
                </ul>
            </div>

            <ProductDetailAssets :images="imageData" @setImages="setImages" />

            <div>
                <div>
                    <strong>Price: </strong>
                    <span>${{ ((productData.price || 1) / 100).toFixed(2) }}</span>
                </div>

                <div>
                    <strong>Stock: </strong>
                    <span>{{ useStock(productData.stock || "UNKNOWN") }}</span>
                </div>
            </div>

            <div>
                <div>
                    <strong>Created At: </strong>
                    <span :title="useDate(productData.createdAt)">{{ useNow(productData.createdAt) }}</span>
                </div>

                <div>
                    <strong>Updated At: </strong>
                    <span :title="useDate(productData.updatedAt)">{{ useNow(productData.updatedAt) }}</span>
                </div>
            </div>

            <hr class="my-4" />

            <div class="my-4">
                <button class="btn btn-primary max-md:w-full md:mr-2 max-md:mb-2" @click="editProduct">Edit Product</button>
                <button class="btn btn-error max-md:w-full" @click="deleteProduct">Delete Product</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ProductDetail, ProductDetailData } from "@/types/types/products";
import { useAuthStore } from "@/stores/auth";
import { useDate, useNow } from "@/use/useDate";
import { useStock } from "@/use/useDatabase";
import { useRequest } from "@/use/useRequest";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";

import ProductDetailAssets from "./ProductDetailAssets.vue";

const auth = useAuthStore();
const router = useRouter();
const $toast = useToast();

const props = defineProps<{ id: string }>();

const productData = ref<Partial<ProductDetailData>>({});
const imageData = ref<string[]>([]);
const loading = ref(false);
const errmsg = ref("");

const getProduct = async () => {
    const pdata = await useRequest<ProductDetail>(`/products/${props.id}`, "GET", null, auth.token, loading);

    if (!pdata.error && pdata.data.status === 200) {
        imageData.value = pdata.json.data.images.split(",").filter((n) => n.length !== 0);
        productData.value = pdata.json.data;
        errmsg.value = "";

        return;
    }

    if (pdata.data.status === 404) {
        errmsg.value = "Product not found!";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const deleteProduct = () => {
    Swal.fire({
        title: "Are you sure you want to remove this product?",
        icon: "warning",
        text: "This will NOT remove orders/ratings containing this product. Consider setting the product to hidden/discontinued.",
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        const pdata = await useRequest<Response>(`/products/${props.id}`, "DELETE", null, auth.token, loading);

        if (!pdata.error && pdata.data.status === 200) {
            $toast.success(`Removed ${productData.value.title}.`);
            productData.value = {};
            errmsg.value = "";
            router.push(`/@/products`);

            return;
        }

        $toast.error("Could not remove product: HTTP Error.");
    });
};

const tags = computed(() => {
    if (!productData.value?.tags) return [];

    return productData.value.tags.split(",").filter((n) => n.length !== 0);
});

const editProduct = () => router.push(`/@/products/${props.id}/edit`);
const setImages = (newImages: string[]) => (imageData.value = newImages);

onMounted(getProduct);
</script>
