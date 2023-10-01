<template>
    <div>
        <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        <p v-else-if="errmsg" class="font-bold my-[10rem] text-center">{{ errmsg }}</p>
        <div v-else-if="!errmsg && productData">
            <div class="my-4">
                <h4 class="font-bold text-lg mb-2" :class="modifiedClass('title')">Title</h4>

                <input
                    class="input input-bordered max-md:w-full max-md:mb-4 min-w-[240px]"
                    :class="{ 'input-error': invalidInput('title') }"
                    type="text"
                    v-model="productDetails.title"
                    maxlength="150"
                />

                <p class="text-error font-bold" v-if="invalidInput('title')">Invalid title.</p>
            </div>

            <div class="my-4">
                <h4 class="font-bold text-lg mb-2" :class="modifiedClass('subtitle')">Subtitle</h4>

                <input
                    class="input input-bordered max-md:w-full max-md:mb-4 min-w-[240px]"
                    :class="{ 'input-error': invalidInput('subtitle') }"
                    type="text"
                    v-model="productDetails.subtitle"
                    maxlength="150"
                />

                <p class="text-error font-bold" v-if="invalidInput('subtitle')">Invalid subtitle.</p>
            </div>

            <div class="my-4">
                <h4 class="font-bold text-lg mb-2" :class="modifiedClass('description')">Description</h4>

                <textarea
                    class="textarea textarea-bordered max-md:w-full max-md:mb-4 min-w-[240px]"
                    :class="{ 'textarea-error': invalidInput('description') }"
                    v-model="productDetails.description"
                ></textarea>

                <p class="text-error font-bold" v-if="invalidInput('description')">Invalid description.</p>
            </div>

            <hr class="my-4" />

            <div class="my-4">
                <h4 class="font-bold text-lg mb-2" :class="modifiedClass('tags')">Tags</h4>
                <ul>
                    <li v-for="tag in productDetails.tags" :key="tag">
                        <button class="btn btn-error min-h-[1.5rem] h-[1.5rem] px-[3px]" @click="removeTag(tag)">
                            <TrashIcon class="stroke-base-300 h-[1rem]" />
                        </button>

                        <span class="btn btn-xs btn-primary ml-1 align-top">#{{ tag }}</span>
                    </li>
                </ul>

                <button class="btn btn-sm my-4" @click="addTag">Add Tag</button>
            </div>

            <hr class="my-4" />

            <div class="my-4">
                <h4 class="font-bold text-lg mb-2" :class="modifiedClass('price')">Price</h4>
                <p class="text-sm opacity-60 my-4">${{ (productDetails.price / 100).toFixed(2) }} (value below is displayed in cents)</p>

                <input
                    class="input input-bordered max-md:w-full max-md:mb-4 min-w-[240px]"
                    :class="{ 'input-error': invalidInput('price') }"
                    type="number"
                    v-model="productDetails.price"
                />

                <p class="text-error font-bold" v-if="invalidInput('price')">Invalid price.</p>
            </div>

            <div class="my-4">
                <h4 class="font-bold text-lg mb-2" :class="modifiedClass('stock')">Stock</h4>

                <select class="select select-bordered max-md:w-full max-md:mb-4 min-w-[240px]" v-model="productDetails.stock">
                    <option value="IN_STOCK">In Stock</option>
                    <option value="OUT_STOCK">Out of Stock</option>
                    <option value="DISCONTINUED">Discontinued</option>
                    <option value="HIDDEN">Hidden</option>
                </select>
            </div>

            <button class="btn btn-success max-md:w-full mb-4" :disabled="isInvalidProduct" @click="setProduct">Update</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ProductDetail, ProductDetailData } from "@/types/types/products";
import type { Response } from "@/types";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, reactive } from "vue";
import Swal from "sweetalert2";
import Joi from "joi";

const auth = useAuthStore();
const router = useRouter();
const $toast = useToast();

const props = defineProps<{
    id: string;
}>();

const valid = {
    title: Joi.string().required().min(3).max(20),
    subtitle: Joi.string().required().min(0).max(50),
    description: Joi.string().required().min(10).max(150),
    tags: Joi.string().required().min(0).max(50),
    price: Joi.number().required().min(100).max(100000),
    stock: Joi.string().required().max(20),
};

const productData = ref<Partial<ProductDetailData>>({});
const loading = ref(false);
const errmsg = ref("");

const productDetails = reactive({
    title: "",
    subtitle: "",
    description: "",
    tags: [] as string[],
    price: 0,
    stock: "UNKNOWN",
});

const setDetails = (details: ProductDetailData) => {
    productDetails.title = details.title;
    productDetails.subtitle = details.subtitle;
    productDetails.description = details.description;
    productDetails.tags = details.tags.split(",").filter((n) => n.length !== 0);
    productDetails.price = details.price;
    productDetails.stock = details.stock;
};

const getDetails = async () => {
    const pdata = await useRequest<ProductDetail>(`/products/${props.id}`, "GET", null, auth.token, loading);

    if (!pdata.error && pdata.data.status === 200) {
        setDetails(pdata.json.data);
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

const setProduct = async () => {
    if (!productData.value) return;

    const updatedData = JSON.parse(JSON.stringify(productDetails));
    const id = props.id ? `/products/${props.id}` : "/products";

    updatedData.tags = productDetails.tags.join(",");

    const pdata = await useRequest<Response>(id, "POST", updatedData, auth.token, loading);

    if (!pdata.error && pdata.data.status === 200) {
        errmsg.value = "";

        $toast.success(`Updated ${productDetails.title}.`);
        router.push(`/@/products/${pdata.json.message}`);

        return;
    }

    $toast.error("Could not update product: HTTP Error.");
    errmsg.value = "HTTP Error.";
};

const addTag = async () => {
    const { value } = await Swal.fire({
        title: "New Tag",
        input: "text",
        inputLabel: "Enter tag name:",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return "Empty tag!";
        },
    });

    const tag = value.toLowerCase();
    const tagc = tag.split("");

    if (tag.length >= 25 || tagc.includes(",") || tagc.includes(" ")) {
        $toast.error("Invalid tag name.");
        return;
    }

    if (productDetails.tags.includes(tag)) {
        $toast.error("Tag already exists!");
        return;
    }

    productDetails.tags.push(tag);
};

const removeTag = (tag: string) => {
    if (!productDetails.tags.includes(tag)) {
        $toast.error("Tag does not exists!");
        return;
    }

    productDetails.tags = productDetails.tags.filter((n) => n !== tag);
};

const productDiffs = computed(() => {
    if (!productData.value) return [];

    const o1 = JSON.parse(JSON.stringify(productDetails));
    const diffs = [];

    o1.tags = o1.tags.join(",");

    for (const k in o1) {
        if (o1[k] !== productData.value[k as keyof typeof productData.value]) {
            diffs.push(k);
        }
    }

    return diffs;
});

const invalidInput = (option: keyof typeof valid) => {
    const { error } = valid[option].validate(productDetails[option]);

    return error;
};

const modifiedClass = (...args: string[]) => {
    for (const a of args) {
        if (productDiffs.value.includes(a)) {
            return "italic before:content-['*']";
        }
    }

    return "";
};

const isInvalidProduct = computed(() => {
    if (loading.value || errmsg.value) return true;

    for (const k in valid) {
        const data = String(productDetails[k as keyof typeof productDetails]);
        const { error } = valid[k as keyof typeof valid].validate(data);

        if (error) return true;
    }

    if (productDiffs.value.length === 0) return true;
    return false;
});

onMounted(() => {
    if (props.id) getDetails();
});
</script>
