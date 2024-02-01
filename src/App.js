import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Implement a emitter to refresh components data from other components
import mitt from 'mitt';
const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.emitter = emitter;

// Mount the app
app.mount('#app');