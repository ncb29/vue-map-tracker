import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Implement a emitter to refresh components data from other components
import mitt from 'mitt';
const emitter = mitt();
const app = createApp( App );
app.config.globalProperties.emitter = emitter;

// When User visit the app first time, set a default settings object
const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

if ( storedSettings === null ) {
    const oDefaultSettings = {
        'intervalValue': 20000,
        'intervalText': '20 Sek.',
        'valueInSec': 20,
        'preciseMode': false
    };

    window.localStorage.setItem( 'StoredSettings', JSON.stringify( oDefaultSettings ) );
}

// Mount the app
app.mount( '#app' );