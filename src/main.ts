import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vueClickOutsideElement from "vue-click-outside-element";
/* eslint-disable */
const app = createApp(App);
app.use(vueClickOutsideElement);
app.use(router);

app.mount("#app");
