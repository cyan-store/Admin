<template>
    <button @click="openProduct">Add Product</button>

    <DialogItem :open="open" @exit="openProduct">
        <div>
            <DelayedInputItem v-model="search.query" placehold="Search..." />
            <button @click="search.sort = search.sort === 'asc' ? 'desc' : 'asc'" :disabled="loading || !!errmsg">
                {{ search.sort.toUpperCase() }}
            </button>

            <p>Found: {{ searchData?.count || 0 }}</p>
        </div>

        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg">
            <table v-if="searchData.products?.length">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Last Updated</th>
                        <th>Add</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in searchData.products" :key="product.id">
                        <td>
                            <img :src="useImage(product.images)" height="100" />
                        </td>
                        <td>
                            <RouterLink :to="`/@/products/${product.id}`">{{ product.title }}</RouterLink>
                        </td>

                        <td>${{ (product.price / 100).toFixed(2) }}</td>
                        <td>{{ product.stock }}</td>

                        <td :title="useDate(product.updatedAt)">{{ useNow(product.updatedAt) }}</td>
                        <td>
                            <button @click="addProduct(product)">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else-if="searchData?.products?.length === 0">Nothing found!</p>
        </div>
        <p v-else>{{ errmsg }}</p>

        <PaginateItem :page="search.page" :disabled="loading || !!errmsg" @clicked="update" />
    </DialogItem>
</template>

<script lang="ts" setup>
import type { ProductSearch, ProductSearchData, ProductSearchDetail } from "@/types/types/products";
import type { OrderProducts } from "@/types/types/orders";
import { useAuthStore } from "@/stores/auth";
import { useDate, useNow } from "@/use/useDate";
import { useRequest } from "@/use/useRequest";
import { useImage } from "@/use/useImage";
import { reactive, ref, watch } from "vue";

import DialogItem from "@/components/general/DialogItem.vue";
import DelayedInputItem from "@/components/general/DelayedInputItem.vue";
import PaginateItem from "@/components/general/PaginateItem.vue";

const auth = useAuthStore();
const open = ref(false);
const search = reactive({
    query: "",
    sort: "asc",
    page: 0,
});

const loading = ref(false);
const errmsg = ref("");
const searchData = ref<Partial<ProductSearchData>>({});

const emits = defineEmits<{
    (e: "pushProduct", p: OrderProducts): void;
}>();

const searchProducts = async () => {
    if (search.query === "") {
        searchData.value = {};
        return;
    }

    const params = new URLSearchParams({
        search: search.query,
        sort: search.sort,
        page: String(search.page),
    });

    const sdata = await useRequest<ProductSearch>(`/products?${params.toString()}`, "GET", null, auth.token, loading);

    if (!sdata.error && sdata.data.status === 200) {
        searchData.value = sdata.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const addProduct = (product: ProductSearchDetail) => {
    const data: OrderProducts = {
        info: {
            id: product.id,
            title: product.title,
            images: product.images,
            price: product.price,
            stock: product.stock,
        },

        amount: "1",
    };

    emits("pushProduct", data);
    open.value = false;
};

const update = (n: number) => (search.page = n);
const openProduct = () => (open.value = !open.value);

const searchReset = () => {
    search.page = 0;
    searchProducts();
};

watch(() => search.page, searchProducts);
watch(() => search.query, searchReset);
watch(() => search.sort, searchReset);
</script>
