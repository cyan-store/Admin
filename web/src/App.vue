<template>
    <NavBar>
        <RouterView />
    </NavBar>
</template>

<script lang="ts" setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
</script>
