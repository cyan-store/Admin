<template>
    <div>
        <p v-if="loading">Loading...</p>
        <div v-else-if="!errmsg && orderData.order">
            <div>
                <h4 :class="modifiedClass('productID', 'quantity')">Products</h4>
                <ul>
                    <li v-for="product in orderProductsData" :key="product.info.id">
                        <div>
                            <RouterLink :to="`/@/products/${product.info.id}`">{{ product.info.title }}</RouterLink>
                            <b> - ({{ product.info.id }})</b>
                        </div>

                        <div>
                            <button @click="addProduct(product)" :disabled="parseInt(product.amount) >= max.amount - 1">+</button>

                            <span>x{{ product.amount }} </span>

                            <button @click="removeProduct(product)" :disabled="isMinProducts(product.amount)">-</button>
                        </div>
                    </li>
                </ul>

                <OrdersDetailEditSearch @push-product="addNewProduct" />
            </div>

            <hr />

            <div>
                <h4>Payment Information</h4>
                <p>Don't modify these values if you don't know what you're doing!</p>

                <div>
                    <h4 :class="modifiedClass('transactionID')">Transaction ID</h4>
                    <p v-if="invalidInput('transactionID')">Invalid transaction ID.</p>

                    <input type="text" v-model="orderDetails.transactionID" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('status')">Payment Status</h4>

                    <select v-model="orderDetails.status">
                        <option value="UNPAID">Unpaid</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                        <option value="CANCELED">Canceled</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>
                </div>

                <div>
                    <h4 :class="modifiedClass('amount')">Amount Paid</h4>
                    <p>${{ (orderDetails.amount / 100).toFixed(2) }} (value below is displayed in cents)</p>
                    <p v-if="invalidInput('amount')">Invalid payment amount.</p>

                    <input type="number" v-model="orderDetails.amount" />
                </div>
            </div>

            <hr />

            <div>
                <h4>Shipping Information</h4>

                <div>
                    <h4 :class="modifiedClass('email')">Email</h4>
                    <p v-if="invalidInput('email')">Invalid email.</p>

                    <input type="text" v-model="orderDetails.email" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('shipping')">Shipping Status</h4>

                    <select v-model="orderDetails.shipping">
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELED">Canceled</option>
                        <option value="UNKNOWN">Unknown</option>
                    </select>
                </div>

                <div>
                    <h4 :class="modifiedClass('shippingName')">Shipping Name</h4>
                    <p v-if="invalidInput('shippingName')">Invalid shipping name.</p>

                    <input type="text" v-model="orderDetails.shippingName" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('city')">City</h4>
                    <p v-if="invalidInput('city')">Invalid city.</p>

                    <input type="text" v-model="orderDetails.city" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('country')">Country</h4>
                    <p v-if="invalidInput('country')">Invalid country.</p>

                    <input type="text" v-model="orderDetails.country" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('line1')">Line #1</h4>
                    <p v-if="invalidInput('line1')">Invalid line #1.</p>

                    <input type="text" v-model="orderDetails.line1" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('line2')">Line #2</h4>
                    <p v-if="invalidInput('line2')">Invalid line #2.</p>

                    <input type="text" v-model="orderDetails.line2" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('postal')">Postal Code</h4>
                    <p v-if="invalidInput('postal')">Invalid postal code.</p>

                    <input type="text" v-model="orderDetails.postal" maxlength="150" />
                </div>

                <div>
                    <h4 :class="modifiedClass('state')">State/Province</h4>
                    <p v-if="invalidInput('state')">Invalid state/province.</p>

                    <input type="text" v-model="orderDetails.state" maxlength="150" />
                </div>

                <div>
                    <pre>{{ orderDiffs }}</pre>
                    <button :disabled="isInvalidOrder" @click="setOrder">Update</button>
                </div>
            </div>
        </div>
        <p v-else>{{ errmsg }}</p>

        <RouterLink :to="`/@/users/${props.user}/orders/${props.order}`">Back to Details</RouterLink>
    </div>
</template>

<script lang="ts" setup>
import type { OrderDetails, OrderDetailsData, OrderProducts } from "@/types/types/orders";
import type { Response } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useToast } from "vue-toast-notification";
import { computed, onMounted, ref, reactive, watch } from "vue";
import Joi from "joi";

import OrdersDetailEditSearch from "./OrdersDetailEditSearch.vue";
import router from "@/router";

const max = {
    items: 11,
    amount: 21,
};

const auth = useAuthStore();
const $toast = useToast();
const props = defineProps<{
    user: string;
    order: string;
}>();

// Request data
const loading = ref(false);
const errmsg = ref("");
const orderData = ref<Partial<OrderDetailsData>>({});

// User modified data
const orderProductsData = ref<OrderProducts[]>([]);
const orderDetails = reactive({
    productID: [] as string[],
    transactionID: "",
    status: "",
    quantity: [] as number[],
    amount: 0,
    email: "",
    shipping: "",
    shippingName: "",
    city: "",
    country: "",
    line1: "",
    line2: "",
    postal: "",
    state: "",
});

const valid = {
    transactionID: Joi.string().required().max(500),
    status: Joi.string().required(), // Validate
    quantity: Joi.string().required().max(150),
    amount: Joi.number().required(),
    email: Joi.string()
        .required()
        .email({ tlds: { allow: false } })
        .required(),
    shipping: Joi.string().required(), // Validate
    shippingName: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    line1: Joi.string().required().min(0),
    line2: Joi.string().required().min(0),
    postal: Joi.string().required(),
    state: Joi.string().required(),
};

// Order management
const getOrder = async () => {
    const odata = await useRequest<OrderDetails>(`/users/${props.user}/orders/${props.order}`, "GET", null, auth.token, loading);

    if (!odata.error && odata.data.status === 200) {
        setDetails(odata.json.data);
        orderData.value = odata.json.data;
        errmsg.value = "";

        return;
    }

    if (odata.data.status === 404) {
        errmsg.value = "Order not found!";

        return;
    }

    errmsg.value = "HTTP Error.";
};

const setOrder = async () => {
    if (!orderData.value.order) return;
    const updatedData = JSON.parse(JSON.stringify(orderDetails));

    updatedData.productID = updatedData.productID.join(",");
    updatedData.quantity = updatedData.quantity.join(",");

    const odata = await useRequest<Response>(`/users/${props.user}/orders/${props.order}`, "POST", updatedData, auth.token, loading);

    if (!odata.error && odata.data.status === 200) {
        errmsg.value = "";

        $toast.success(`Updated ${orderDiffs.value.join(", ")} for ${props.order}`);
        router.push(`/@/users/${props.user}/orders/${props.order}`);

        return;
    }

    $toast.error("Could not update order: HTTP Error.");
    errmsg.value = "HTTP Error.";
};

const setDetails = (data: OrderDetailsData) => {
    orderDetails.productID = data.order.productID.split(",");
    orderDetails.transactionID = data.order.transactionID;
    orderDetails.status = data.order.status;
    orderDetails.quantity = data.order.quantity.split(",").map((n) => parseInt(n));
    orderDetails.amount = data.order.amount;
    orderDetails.email = data.order.email;
    orderDetails.shipping = data.order.shipping;
    orderDetails.shippingName = data.order.shippingName;
    orderDetails.city = data.order.city;
    orderDetails.country = data.order.country;
    orderDetails.line1 = data.order.line1;
    orderDetails.line2 = data.order.line2;
    orderDetails.postal = data.order.postal;
    orderDetails.state = data.order.state;

    orderProductsData.value = data.products;
};

// Product management
const addProduct = (product: OrderProducts) => (product.amount = String(parseInt(product.amount) + 1));
const removeProduct = (product: OrderProducts) => {
    product.amount = String(parseInt(product.amount) - 1);

    const ids = orderProductsData.value.map((n) => n.info.id);
    const idx = ids.indexOf(product.info.id);

    if (idx === -1) return;
    if (parseInt(product.amount) <= 0) {
        orderProductsData.value.splice(idx, 1);
    }
};

const addNewProduct = (product: OrderProducts) => {
    const ids = orderProductsData.value.map((n) => n.info.id);

    if (ids.includes(product.info.id)) {
        $toast.error("Cannot add duplicate product!");
        return;
    }

    orderProductsData.value.push(product);
};

const isMinProducts = (amount: string) => {
    return orderProductsData.value.length <= 1 && parseInt(amount) <= 1;
};

// Validate inputs
const orderDiffs = computed(() => {
    if (!orderData.value.order) return [];

    const o1 = JSON.parse(JSON.stringify(orderDetails));
    const diffs = [];

    o1.productID = o1.productID.join(",");
    o1.quantity = o1.quantity.join(",");

    for (const k in o1) {
        if (o1[k] !== orderData.value.order[k as keyof typeof orderData.value.order]) {
            diffs.push(k);
        }
    }

    return diffs;
});

const isInvalidOrder = computed(() => {
    if (loading.value || errmsg.value) return true;

    for (const k in valid) {
        const data = String(orderDetails[k as keyof typeof orderDetails]);
        const { error } = valid[k as keyof typeof valid].validate(data);

        if (error) return true;
    }

    if (orderDetails.line1 === "" && orderDetails.line2 === "") return true;
    if (orderDiffs.value.length === 0) return true;

    return false;
});

const invalidInput = (option: keyof typeof valid) => {
    const { error } = valid[option].validate(orderDetails[option]);

    return error;
};

const modifiedClass = (...args: string[]) => {
    for (const a of args) {
        if (orderDiffs.value.includes(a)) {
            return "modified";
        }
    }

    return "";
};

onMounted(getOrder);
watch(
    () => orderProductsData,
    () => {
        const ids = orderProductsData.value.map((n) => n.info.id);
        const quantity = orderProductsData.value.map((n) => parseInt(n.amount));

        orderDetails.productID = ids;
        orderDetails.quantity = quantity;
    },

    { deep: true },
);
</script>

<style scoped>
.modified {
    color: red;
}
</style>
