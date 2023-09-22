<template>
    <div>
        <div>
            <DelayedInputItem v-model="filter.search" placehold="Search product..." />
            <button @click="updateSort" :disabled="loading">{{ filter.sort.toUpperCase() }}</button>
            <button @click="newProduct">New Product</button>

            <p>Found: {{ productData?.count || 0 }}</p>
        </div>

        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg">
            <table v-if="productData?.products?.length !== 0">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Tags</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <ProductListingItem v-for="product in productData.products" :key="product.id" :data="product" />
                </tbody>
            </table>
            <p v-else>Nothing found!</p>
        </div>
        <p v-else>{{ errmsg }}</p>

        <PaginateItem @clicked="update" :page="filter.page" :disabled="loading" />
    </div>
</template>

<script lang="ts" setup>
import type { ProductSearch, ProductSearchData } from "@/types/types/products";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useRouter } from "vue-router";
import { onMounted, reactive, ref, watch } from "vue";

import DelayedInputItem from "@/components/general/DelayedInputItem.vue";
import PaginateItem from "@/components/general/PaginateItem.vue";
import ProductListingItem from "./ProductListingItem.vue";

const auth = useAuthStore();
const router = useRouter();

const filter = reactive({
    search: "",
    page: 0,
    sort: "asc",
});

const loading = ref(false);
const errmsg = ref("");
const productData = ref<Partial<ProductSearchData>>({});

const update = (n: number) => (filter.page = n);
const updateSort = () => {
    filter.sort = filter.sort == "asc" ? "desc" : "asc";
    filter.page = 0;
};

const searchProduct = async () => {
    const params = new URLSearchParams({
        search: filter.search,
        sort: filter.sort,
        page: String(filter.page),
    });

    const sdata = await useRequest<ProductSearch>(`/products?${params.toString()}`, "GET", null, auth.token, loading);

    if (!sdata.error && sdata.data.status === 200) {
        productData.value = sdata.json.data;
        errmsg.value = "";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const searchReset = () => {
    filter.page = 0;
    searchProduct();
};

const newProduct = () => {
    router.push("/@/products/new");
};

watch(() => filter.page, searchProduct);
watch(() => filter.search, searchReset);
watch(() => filter.sort, searchReset);

onMounted(searchProduct);
</script>
