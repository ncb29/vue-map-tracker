<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {
        el: '#header',
        name: "Header",
        data: () => ({ 
            isTracking: false
        }),
        methods: {
            clientGeoData,

            onGetClientsPosition() {
                this.emitter.emit("start-reload");
                clientGeoData.call(this);     
            },

            onTrackClientsPosition(bStartTracking) {
                if (bStartTracking === true) {

                    this.isTracking = !this.isTracking;

                    // First call client geo data directly...
                    clientGeoData.call(this);
                    this.emitter.emit("start-reload");

                    // ... then call data by interval
                    this.startTrackingInterval = setInterval(function() {                                           
                        clientGeoData.call(this);
                        this.emitter.emit("start-reload");
                    }.bind(this), 20000);  

                } else {

                    this.isTracking = !this.isTracking;
                    clearInterval(this.startTrackingInterval);

                    this.emitter.emit("start-reload");

                    // Tracking was stopped. Get last position + send message.
                    const oCurrentStoredPosition = JSON.parse(window.localStorage.getItem("ClientsCurrentPosition"));

                    oCurrentStoredPosition.message = "Das Tracking wurde beendet";

                    window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oCurrentStoredPosition));
                    this.emitter.emit("update-components");    
                }              
            },
        },      
        created: function () {
            clientGeoData.call(this);
        },  
        mounted() {
        
        }
    }
</script>

<template>
    <div class="app__main-container--header" id="header">
        <div class="app__main-container--header-title">
            <div class="app__main-container--header-logo">
                <svg  version="1.1" id="Ebene_1" xmlns="&ns_svg;" xmlns:xlink="&ns_xlink;" width="68" height="80" viewBox="0 0 68 80"
                    overflow="visible" enable-background="" xml:space="preserve">
                    <g fill="#fff">
                        <path d="M50.31,55.998l-3.085,5.798l15.095-2.467C59.276,57.8,55.151,56.708,50.31,55.998L50.31,55.998z M11.422,57.262
                            C4.429,59.106,0,62.128,0,66.616c0.002,0.967,0.214,1.92,0.619,2.797l24.228-3.959L11.422,57.262z M67.431,63.998l-33.72,5.498
                            l8.892,10.116C57.208,78.304,68,73.639,68,66.616C68,65.681,67.795,64.811,67.431,63.998L67.431,63.998z M28.015,70.441
                            L5.23,74.169C11.253,77.897,21.883,80,34.001,80c0.735,0,1.452-0.02,2.176-0.035L28.015,70.441z"/>
                        <path d="M34.001,0c-13.04,0-23.739,10.666-23.739,23.676c0,5.001,1.589,9.662,4.273,13.494L29.924,63.77l0.063,0.085
                            c0.609,0.791,1.201,1.417,1.897,1.877c0.695,0.46,1.56,0.735,2.407,0.65c1.693-0.166,2.732-1.363,3.72-2.701l0.049-0.068
                            l16.988-28.91l0.012-0.021c0.396-0.719,0.691-1.454,0.944-2.166c1.143-2.806,1.734-5.809,1.734-8.841
                            C57.739,10.666,47.042,0,34.001,0z M34.001,13.636c5.657,0,10.072,4.408,10.072,10.038c0,5.635-4.415,10.042-10.072,10.042
                            c-5.658,0-10.074-4.407-10.074-10.042C23.927,18.044,28.347,13.636,34.001,13.636L34.001,13.636z"/>
                    </g>
                </svg>
            </div>
            
            <h2 class="app__main-container--header-title">OpenStreetMap-Tracker</h2>
        </div>
        
        <div class="app__main-container--header-buttons"> 
            <button class="btn" @click="onGetClientsPosition">Standort</button>
            <button class="btn" @click="onTrackClientsPosition(true)" v-bind:class="{btnHide: isTracking}">Starten</button>
            <button class="btn btnHide" @click="onTrackClientsPosition(false)" v-bind:class="{btnShow: isTracking}">Beenden</button>
        </div>        
    </div>
</template>