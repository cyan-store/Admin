import "vue-toast-notification/dist/theme-bootstrap.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ToastPlugin from "vue-toast-notification";
import VueStarRating from "vue-star-rating";

const app = createApp(App);

app.use(createPinia());
app.component("star-rating", VueStarRating.default);
app.use(router);
app.use(ToastPlugin);

app.mount("#app");
