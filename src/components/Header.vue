<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {
        el: '#header',
        name: "Header",
        data: () => ({ 
            isNewPosition: false,
            isTracking: false
        }),
        methods: {
            clientGeoData,

            onOpenSettingsDialog() {
                this.emitter.emit("open-settings");
            },

            onGetClientsPosition() {         
                this.isNewPosition = !this.isNewPosition;       
                clientGeoData.call(this, "single");     
                this.emitter.emit("start-reload");
            },

            onTrackClientsPosition(bStartTracking) {
                if (bStartTracking === true) {

                    this.isTracking = !this.isTracking;

                    // First call client geo data directly...
                    clientGeoData.call(this, "multiple");
                    this.emitter.emit("start-reload");

                    // ... then call data by interval
                    this.startTrackingInterval = setInterval(function() {                                           
                        clientGeoData.call(this, "multiple");
                        this.emitter.emit("start-reload");
                    }.bind(this), 20000);  

                } else {
                    this.emitter.emit("start-reload");
                    this.isTracking = !this.isTracking;
                    clearInterval(this.startTrackingInterval);                    

                    console.log("Last position after stop tracking (window.variable)", window.oCurrentPositionObject);

                    window.oCurrentPositionObject.message = "Das Tracking wurde beendet";                    
                    this.emitter.emit("update-components", window.oCurrentPositionObject);    
                }              
            },
        },      
        created() {
            
        },  
        mounted() {
            clientGeoData.call(this , "initial");

            this.emitter.on("update-components", (oPositionObject) => {    
                if (oPositionObject.trackingType === "single") {
                    setTimeout(function() {                                           
                        this.isNewPosition = !this.isNewPosition;
                    }.bind(this), 1000);                      
                }
            });
        }
    }
</script>

<template>
    <div class="app__main-container--header" id="header">
        <div class="app__main-container--header-firstrow">
            <div class="app__main-container--header-title">
                <div class="app__main-container--header-logo">
                    <svg class="svgSpriteBox"><use xlink:href="#appLogo"></use></svg>
                </div>            
                <h2 class="app__main-container--header-title">OpenStreetMap-Tracker</h2>
            </div>            

            <button class="btn btn--icon btn--icon-notext" @click="onOpenSettingsDialog">
                <svg class="svgSpriteBox"><use xlink:href="#settings"></use></svg>
            </button>
        </div>
        
        <div class="app__main-container--header-buttons"> 
            <button class="btn btn--icon" v-bind:class="{active: isNewPosition}" @click="onGetClientsPosition">
                <svg class="svgSpriteBox"><use xlink:href="#trackPersonIcon"></use></svg>
                Standort
            </button>
            <button class="btn btn--icon" v-bind:class="{btnHide: isTracking}" @click="onTrackClientsPosition(true)">
                <svg class="svgSpriteBox"><use xlink:href="#doubleMarkers"></use></svg>
                Starten
            </button>
            <button class="btn btn--icon active btnHide" v-bind:class="{btnShow: isTracking}" @click="onTrackClientsPosition(false)">
                <svg class="svgSpriteBox"><use xlink:href="#doubleMarkers"></use></svg>
                Beenden
            </button>
        </div>        
    </div>
</template>