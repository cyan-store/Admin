<template>
    <div>
        <div class="md:flex max-md:w-[calc(100vw-1rem)] text-center">
            <DelayedInputItem classes="input input-bordered input-sm max-md:w-full" v-model="filter.search" placehold="Search product..." />
            <button class="btn btn-sm btn-primary max-md:w-full md:mx-2 max-md:my-2" @click="updateSort" :disabled="loading">
                {{ filter.sort.toUpperCase() }}
            </button>
            <button class="btn btn-sm btn-secondary max-md:w-full" @click="newProduct">New Product</button>
        </div>

        <div class="md:flex my-2 max-md:w-[calc(100vw-1rem)] text-center">
            <PaginateItem @clicked="update" :page="filter.page" :disabled="loading" />
            <div class="py-[2px] md:ml-2">
                <strong>Found: </strong>
                <span>{{ productData?.count || 0 }}</span>
            </div>
        </div>

        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p v-else-if="errmsg" class="font-bold my-4 text-center">{{ errmsg }}</p>
        <template v-else>
            <p v-if="productData?.products?.length === 0" class="font-bold my-4 text-center">No orders found!</p>
            <table v-else class="table">
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
        </template>
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
    sort: "desc",
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
