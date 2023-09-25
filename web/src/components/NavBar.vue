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
                        <li>
                            <RouterLink to="/@/system/logs">
                                <CommandLineIcon class="h-4" />
                                <span>Audit Log</span>
                            </RouterLink>
                        </li>
                    </ul>

                    <h4 class="opacity-60 font-bold mx-2 text-xs mt-4 mb-2">Recent</h4>
                    <ul>
                        <li>
                            <RouterLink to="/@/recent">
                                <CreditCardIcon class="h-4" />
                                <span>Orders</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/recent/ratings">
                                <StarIcon class="h-4" />
                                <span>Ratings</span>
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
import { useAuthStore } from "@/stores/auth";
import { useSite } from "@/use/useImage";
import { RouterLink } from "vue-router";
import { computed } from "vue";

import { HomeIcon, Cog6ToothIcon, CommandLineIcon, CreditCardIcon, StarIcon, UsersIcon, ShoppingBagIcon, ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/outline";

const auth = useAuthStore();
const logo = computed(() => useSite("logo/logo2.png"));

const logout = () => {
    if (confirm("Are you sure you want to logout?")) {
        auth.logout();
    }
};
</script>
