<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg && productData">
            <div>
                <h4 :class="modifiedClass('title')">Title</h4>
                <p v-if="invalidInput('title')">Invalid title.</p>

                <input type="text" v-model="productDetails.title" maxlength="150" />
            </div>

            <div>
                <h4 :class="modifiedClass('subtitle')">Subtitle</h4>
                <p v-if="invalidInput('subtitle')">Invalid subtitle.</p>

                <input type="text" v-model="productDetails.subtitle" maxlength="150" />
            </div>

            <div>
                <h4 :class="modifiedClass('description')">Description</h4>
                <p v-if="invalidInput('description')">Invalid description.</p>

                <textarea v-model="productDetails.description"></textarea>
            </div>

            <div>
                <h4 :class="modifiedClass('tags')">Tags</h4>
                <ul>
                    <li v-for="tag in productDetails.tags" :key="tag">
                        <button @click="removeTag(tag)">Remove</button>
                        <span>#{{ tag }}</span>
                    </li>
                </ul>

                <button @click="addTag">Add Tag</button>
            </div>

            <div>
                <h4 :class="modifiedClass('price')">Price</h4>
                <p>${{ (productDetails.price / 100).toFixed(2) }} (value below is displayed in cents)</p>
                <p v-if="invalidInput('price')">Invalid price.</p>

                <input type="number" v-model="productDetails.price" />
            </div>

            <div>
                <h4 :class="modifiedClass('stock')">Stock</h4>
                <select v-model="productDetails.stock">
                    <option value="IN_STOCK">In Stock</option>
                    <option value="OUT_STOCK">Out of Stock</option>
                    <option value="DISCONTINUED">Discontinued</option>
                    <option value="HIDDEN">Hidden</option>
                </select>
            </div>

            <div>
                <pre>{{ productDiffs }}</pre>
                <button :disabled="isInvalidProduct" @click="setProduct">Update</button>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>
    </div>
</template>

<script lang="ts" setup>
import type { ProductDetail, ProductDetailData } from "@/types/types/products";
import type { Response } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, reactive } from "vue";
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

// TODO: Custom prompt (using swal)
// TODO: Improved tag validation
const addTag = () => {
    const tag = String(prompt("Enter tag name:"));

    if (["undefined", "null", ""].includes(tag) || tag.length >= 25 || tag.split("").includes(",")) {
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
            return "modified";
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

<style scoped>
.modified {
    color: red;
}
</style>
