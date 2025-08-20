import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import App from "@/App.vue";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@/assets/styles/main.css";

// Create Vue app instance
const app = createApp(App);

// Use Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Use Vue Router
app.use(router);

// Use toast notifications
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "bottom-right",
});

// Mount the app
app.mount("#app");
