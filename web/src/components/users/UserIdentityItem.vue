<template>
    <tr>
        <td>{{ data.provider }}</td>
        <td>{{ data.user_id }}</td>
        <td>{{ data.connection }}</td>
        <td>{{ data.isSocial ? "Yes" : "No" }}</td>
    </tr>
</template>

<script lang="ts" setup>
import type { Auth0Identities } from "@/types/types/users";

defineProps<{ data: Auth0Identities }>();
</script>
