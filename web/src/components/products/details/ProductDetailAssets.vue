<template>
    <div>
        <hr class="my-4" />

        <div v-if="props.images.length" class="my-4 flex flex-wrap">
            <div v-for="i in props.images" :key="i" class="avatar m-2">
                <div class="w-24 rounded-lg">
                    <img :src="useAsset(i)" />
                    <button @click="remove(i)" class="z-50 absolute top-0 l-0 w-full h-full bg-[#000] opacity-0 hover:opacity-60 transition-opacity">
                        <TrashIcon class="stroke-error h-8 m-auto" />
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="my-4 italic">Product has no images.</p>

        <button class="btn btn-sm" @click="openUpload">Upload</button>

        <DialogItem :open="open" @exit="openUpload">
            <div>
                <p v-if="errmsg" class="font-bold my-4">{{ errmsg }}</p>
                <p v-if="!validFile" class="font-bold my-4 text-error">File must be image/jpeg!</p>
            </div>

            <input class="file-input file-input-bordered w-full" type="file" ref="file" :disabled="loading" @change="setAsset" />
            <button class="btn btn-primary w-full my-4" :disabled="!validFile || loading" @click="upload">Upload</button>

            <img v-if="loading" class="animate-spin mx-auto my-4" src="/svg/loading-spinner.svg" width="50" />
        </DialogItem>

        <hr class="my-4" />
    </div>
</template>

<script lang="ts" setup>
import type { RemoveResponse, UploadResponse } from "@/types/types/assets";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import { useAsset } from "@/use/useImage";
import { useRequest } from "@/use/useRequest";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import Swal from "sweetalert2";

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
        } else {
            throw new Error(`Invalid code: ${adata.status}`);
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

const remove = (id: string) => {
    Swal.fire({
        title: "Are you sure you want to remove this image?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then(async (result) => {
        if (!result.isConfirmed) return;
        const params = new URLSearchParams({ asset: id });
        const rdata = await useRequest<RemoveResponse>(
            `/products/${route.params.id}/upload?${params.toString()}`,
            "DELETE",
            null,
            auth.token,
            loading,
        );

        if (!rdata.error && rdata.data.status === 200) {
            errmsg.value = "";
            open.value = true;

            emits("setImages", rdata.json.data.images);
            openUpload();

            return;
        }

        errmsg.value = "HTTP Error.";
    });
};

const validFile = computed(() => asset.value?.type === "image/jpeg");
</script>
