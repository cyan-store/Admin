<template>
    <div>
        <pre>{{ props.images }}</pre>
        <div>
            <ul>
                <li v-for="i in props.images" :key="i">
                    <span>{{ i }}</span>
                    <button @click="remove(i)">Remove</button>
                </li>
            </ul>

            <button @click="openUpload">Upload</button>
        </div>

        <DialogItem :open="open" @exit="openUpload">
            <div>
                <p v-if="loading">Loading...</p>
                <p v-else-if="errmsg">{{ errmsg }}</p>

                <p v-if="!validFile">File must be image/jpeg!</p>
            </div>

            <input type="file" ref="file" :disabled="loading" @change="setAsset" />
            <button :disabled="!validFile || loading" @click="upload">Upload</button>
        </DialogItem>
    </div>
</template>

<script lang="ts" setup>
import type { RemoveResponse, UploadResponse } from "@/types/types/assets";
import { useAuthStore } from "@/stores/auth";
import { useRequest } from "@/use/useRequest";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

import DialogItem from "@/components/general/DialogItem.vue";

const props = defineProps<{ images: string[] }>();
const emits = defineEmits<{ (e: "setImages", newImages: string[]): void }>();

const route = useRoute();
const auth = useAuthStore();

const file = ref<HTMLInputElement | null>(null);
const asset = ref<File>();
const open = ref(false);

const errmsg = ref("");
const loading = ref(false);

const setAsset = () => {
    if (!file.value || !file.value.files) return;

    asset.value = file.value.files[0];
};

const openUpload = () => {
    open.value = !open.value;
    asset.value = undefined;

    if (file.value) {
        file.value.value = "";
    }
};

const upload = async () => {
    if (!asset.value) return;

    const form = new FormData();

    loading.value = true;
    form.append("upload", asset.value);

    try {
        const adata = await fetch(`${import.meta.env.VITE_API}/products/${route.params.id}/upload`, {
            method: "POST",
            headers: { authorization: `Bearer ${auth.token}` },
            body: form,
        });

        if (adata.status == 200) {
            const json: UploadResponse = await adata.json();
            emits("setImages", json.data.images);

            errmsg.value = "";
            open.value = true;

            openUpload();
        }
    } catch (err) {
        console.error("Upload error:", err);

        errmsg.value = "HTTP error.";
        asset.value = undefined;

        if (file.value) {
            file.value.value = "";
        }
    }

    loading.value = false;
};

const remove = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const params = new URLSearchParams({ asset: id });
    const rdata = await useRequest<RemoveResponse>(`/products/${route.params.id}/upload?${params.toString()}`, "DELETE", null, auth.token, loading);

    if (!rdata.error && rdata.data.status === 200) {
        errmsg.value = "";
        open.value = true;

        emits("setImages", rdata.json.data.images);
        openUpload();

        return;
    }

    errmsg.value = "HTTP Error.";
};

const validFile = computed(() => asset.value?.type === "image/jpeg");
</script>