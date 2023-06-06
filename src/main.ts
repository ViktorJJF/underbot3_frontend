import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import store from './store';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// plugins
import moshaToasTify from '@/plugins/moshaToastify';
import dateFns from '@/plugins/dateFns';
import uuid from '@/plugins/uuid';
import deepCopy from '@/plugins/deepCopy';

// import styles
import '@/assets/scss/main.scss';
// import '@/assets/css/databot.css';

const app = createApp(App);

app.use(ElementPlus);
app.use(moshaToasTify);
app.use(dateFns);
app.use(uuid);
app.use(deepCopy);
app.use(router).use(store).mount('#app');
