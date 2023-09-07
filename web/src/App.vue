<template>
    <NavBar />
    <RouterView />
</template>

<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
</script>

<style>
.invalid {
    border: 1px solid red;
}
</style>
