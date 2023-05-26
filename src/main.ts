import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import store from './store';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// import styles
import '@/assets/scss/main.scss';

const app = createApp(App);

app.use(ElementPlus);
app.use(router).use(store).mount('#app');
