<template>
    <div>
        <p v-if="loading"></p>
        <div v-else-if="!errmsg">
            <div>
                <h4>{{ productData.title }}</h4>
                <p>{{ productData.subtitle }}</p>
            </div>

            <div>
                <ul v-if="tags?.length">
                    <li v-for="tag in tags" :key="tag">#{{ tag }}</li>
                </ul>

                <p>{{ productData.description }}</p>
            </div>

            <div v-if="images.length">
                <img v-for="img in images" :key="img" :src="img" height="100" />
            </div>

            <div>
                <div>
                    <b>Price: </b>
                    <span>${{ ((productData.price || 1) / 100).toFixed(2) }}</span>
                </div>

                <div>
                    <b>Stock: </b>
                    <span>{{ productData.stock }}</span>
                </div>
            </div>

            <!-- TODO: Proper dates -->
            <div>
                <div>
                    <b>Created At: </b>
                    <span>{{ productData.createdAt }}</span>
                </div>

                <div>
                    <b>Updated At: </b>
                    <span>{{ productData.updatedAt }}</span>
                </div>
            </div>

            <div>
                <button @click="editProduct">Edit Product</button>
                <button @click="deleteProduct">Delete Product</button>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>
    </div>
</template>

<script lang="ts" setup>
import type { ProductDetail, ProductDetailData } from "@/types/types/products";
import { useRequest } from "@/use/useRequest";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useAsset } from "@/use/useImage";

const auth = useAuthStore();
const router = useRouter();
const props = defineProps<{ id: string }>();

const productData = ref<Partial<ProductDetailData>>({});
const loading = ref(false);
const errmsg = ref("");

const getProduct = async () => {
    const pdata = await useRequest<ProductDetail>(`/products/${props.id}`, "GET", null, auth.token, loading);

    if (!pdata.error && pdata.data.status === 200) {
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

const deleteProduct = async () => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    const pdata = await useRequest<Response>(`/products/${props.id}`, "DELETE", null, auth.token, loading);

    if (!pdata.error && pdata.data.status === 200) {
        productData.value = {};
        errmsg.value = "";

        router.push(`/@/products`);
        return;
    }

    // TODO: Use custom alert, maybe a toast
    alert("HTTP Error.");
};

const tags = computed(() => {
    if (!productData.value?.tags) return [];

    return productData.value.tags.split(",").filter((n) => n.length !== 0);
});

const images = computed(() => {
    if (!productData.value.images) return [];

    return productData.value.images.split(",").map((img) => useAsset(img));
});

const editProduct = () => router.push(`/@/products/${props.id}/edit`);
onMounted(getProduct);
</script>
