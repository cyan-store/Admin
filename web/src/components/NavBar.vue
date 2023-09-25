<template>
    <div class="drawer" :class="{ 'lg:drawer-open': auth.authorized }">
        <input type="checkbox" class="drawer-toggle" />
        <div class="drawer-content p-4">
            <slot />
        </div>
        <div class="drawer-side">
            <div class="menu w-80 min-h-full bg-base-200 text-base-content">
                <img :src="logo" width="120" class="mb-4 ml-2" />
                <template v-if="auth.authorized">
                    <h4 class="opacity-60 font-bold mx-2 text-xs my-2">System</h4>
                    <ul>
                        <li class="active">
                            <RouterLink to="/@">
                                <HomeIcon class="h-4" />
                                <span>Home</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/system">
                                <Cog6ToothIcon class="h-4" />
                                <span>Settings</span>
                            </RouterLink>
                        </li>
                    </ul>

                    <h4 class="opacity-60 font-bold mx-2 text-xs mt-4 mb-2">Management</h4>
                    <ul>
                        <li>
                            <RouterLink to="/@/users">
                                <UsersIcon class="h-4" />
                                <span>Users</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/products">
                                <ShoppingBagIcon class="h-4" />
                                <span>Products</span>
                            </RouterLink>
                        </li>
                    </ul>

                    <h4 class="opacity-60 font-bold mx-2 text-xs mt-4 mb-2">Panel</h4>
                    <ul>
                        <li>
                            <a @click="logout">
                                <ArrowLeftOnRectangleIcon class="h-4" />
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { HomeIcon, Cog6ToothIcon, UsersIcon, ShoppingBagIcon, ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import { useSite } from "@/use/useImage";
import { RouterLink } from "vue-router";
import { computed } from "vue";

const auth = useAuthStore();
const logo = computed(() => useSite("logo/logo2.png"));

const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
        auth.logout();
    }
};
</script>
