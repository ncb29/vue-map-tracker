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

                    // Tracking was stopped. Get last position + send message.
                    const oCurrentStoredPosition = JSON.parse(window.localStorage.getItem("ClientsCurrentPosition"));

                    oCurrentStoredPosition.message = "Das Tracking wurde beendet";

                    window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oCurrentStoredPosition));
                    this.emitter.emit("start-reload");
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
                <svg class="svgSpriteBox"><use xlink:href="#appLogo"></use></svg>
            </div>
            
            <h2 class="app__main-container--header-title">OpenStreetMap-Tracker</h2>
        </div>
        
        <div class="app__main-container--header-buttons"> 
            <button class="btn btn--icon" @click="onGetClientsPosition">
                <svg class="svgSpriteBox"><use xlink:href="#trackPersonIcon"></use></svg>
                Standort
            </button>
            <button class="btn btn--icon" @click="onTrackClientsPosition(true)" v-bind:class="{btnHide: isTracking}">
                <svg class="svgSpriteBox"><use xlink:href="#doubleMarkers"></use></svg>
                Starten
            </button>
            <button class="btn btn--icon btnHide" @click="onTrackClientsPosition(false)" v-bind:class="{btnShow: isTracking}">
                <svg class="svgSpriteBox"><use xlink:href="#doubleMarkers"></use></svg>
                Beenden
            </button>
        </div>        
    </div>
</template>