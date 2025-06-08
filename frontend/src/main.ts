import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const app = createApp(App)
const pinia = createPinia();

app.use(pinia);
app.use(ToastPlugin);

app.mount("#app");
