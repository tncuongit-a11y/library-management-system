import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // Import router từ thư mục cấu hình

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router); // Bắt buộc phải nằm ở đây

app.mount('#app'); // Bắt buộc nằm cuối cùng