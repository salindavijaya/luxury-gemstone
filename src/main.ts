import { createApp } from "vue";
import App from "./App.vue";

// optional imports if present
import { createPinia } from "pinia";
import router from "./router";
import "@/styles/main.css";

const app = createApp(App);
app.use(createPinia());
if (router) app.use(router);
app.mount("#app");
