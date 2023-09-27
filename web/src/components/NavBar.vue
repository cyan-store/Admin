<template>
    <div class="drawer" :class="{ 'drawer-open': auth.authorized && open, 'md:drawer-open': auth.authorized }">
        <input type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <div class="md:p-4 p-2" :class="{ 'max-md:hidden': auth.authorized && open }">
                <slot />
            </div>

            <button v-if="auth.authorized" class="btn btn-primary md:hidden fixed z-50 top-[calc(100vh-70px)] left-[calc(100vw-70px)] px-2" @click="open = !open">
                <Bars3Icon class="h-6" />
            </button>
        </div>
        <div class="drawer-side">
            <div class="menu md:w-80 min-h-full bg-base-200 text-base-content max-md:w-[100vw] relative">
                <img :src="logo" width="120" class="mb-4 ml-2" />
                <template v-if="auth.authorized">
                    <h4 class="opacity-60 font-bold mx-2 text-xs my-2">System</h4>
                    <ul>
                        <li class="active">
                            <RouterLink to="/@" @click="open = false">
                                <HomeIcon class="h-4" />
                                <span>Home</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/system" @click="open = false">
                                <Cog6ToothIcon class="h-4" />
                                <span>Settings</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/system/logs" @click="open = false">
                                <CommandLineIcon class="h-4" />
                                <span>Audit Log</span>
                            </RouterLink>
                        </li>
                    </ul>

                    <h4 class="opacity-60 font-bold mx-2 text-xs mt-4 mb-2">Recent</h4>
                    <ul>
                        <li>
                            <RouterLink to="/@/recent" @click="open = false">
                                <CreditCardIcon class="h-4" />
                                <span>Orders</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/recent/ratings" @click="open = false">
                                <StarIcon class="h-4" />
                                <span>Ratings</span>
                            </RouterLink>
                        </li>
                    </ul>

                    <h4 class="opacity-60 font-bold mx-2 text-xs mt-4 mb-2">Management</h4>
                    <ul>
                        <li>
                            <RouterLink to="/@/users" @click="open = false">
                                <UsersIcon class="h-4" />
                                <span>Users</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/@/products" @click="open = false">
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

                    <p class="absolute top-[calc(100%-1.5rem)] w-[95%] text-right opacity-60 text-xs font-bold">Welcome {{ auth.userData.name }}</p>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useSite } from "@/use/useImage";
import { RouterLink } from "vue-router";
import { computed, ref } from "vue";

import {
    Bars3Icon,
    HomeIcon,
    Cog6ToothIcon,
    CommandLineIcon,
    CreditCardIcon,
    StarIcon,
    UsersIcon,
    ShoppingBagIcon,
    ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const auth = useAuthStore();
const open = ref(false);
const logo = computed(() => useSite("logo/logo2.png"));

const logout = () => {
    open.value = false;

    if (confirm("Are you sure you want to logout?")) {
        auth.logout();
    }
};
</script>
