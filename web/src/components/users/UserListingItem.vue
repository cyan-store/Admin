<template>
    <tr>
        <td>
            <img :src="data.picture" width="50" height="50" />
        </td>

        <td>{{ data.name }}</td>
        <td>{{ data.email }}</td>
        <td>{{ data.email_verified ? "Yes" : "No" }}</td>
        <td>{{ data.user_id }}</td>
        <td>{{ data.logins_count }}</td>
        <td>{{ data.last_login }}</td>

        <td>
            <button @click="details">Details</button>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import type { Auth0UserData } from "@/types/types/users";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
    data: Auth0UserData;
}>();

const details = () => {
    router.push(`/@/users/${props.data.user_id}`);
};
</script>
