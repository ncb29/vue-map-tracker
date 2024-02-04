<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {
        el: '#header',
        name: "Header",
        data: () => ({ 
            isNewPosition: false,
            isTracking: false,
            isSettingsOpen: false
        }),
        methods: {
            clientGeoData,

            onOpenSettingsDialog() { 
                this.isSettingsOpen = !this.isSettingsOpen; 

                // We need the isTracking boolean to check if tracking is active when define new interval value.            
                this.emitter.emit("open-settings", this.isTracking);
            },

            onGetClientsPosition() {         
                this.isNewPosition = !this.isNewPosition; 

                // If button is pressed, check if current tracking is active. When stop tracking.
                if (this.isTracking === true) {
                    this.onTrackClientsPosition.call(this, false);

                    // We need to wait a moment before calling new single position.
                    setTimeout(function() { 
                        clientGeoData.call(this, "single");
                    }.bind(this), 4000);  
                    
                } else {
                    clientGeoData.call(this, "single");
                }
                     
                this.emitter.emit("start-reload");
            },

            onTrackClientsPosition(bStartTracking) {
                if (bStartTracking === true) {
                    let nInterval;
                    const storedInterval = JSON.parse(window.localStorage.getItem("SelectedTrackingInterval"));

                    if (storedInterval !== null && storedInterval.value !== "") {
                        nInterval = storedInterval.value;
                        console.log("Current selected interval", nInterval)  
                    } else {
                        // Fallback value
                        nInterval = 20000;
                    }  

                    this.isTracking = !this.isTracking;

                    // First call client geo data directly...
                    clientGeoData.call(this, "multiple");
                    this.emitter.emit("start-reload");

                    // ... then call data by interval
                    this.startTrackingInterval = setInterval(function() { 
                        console.log("Current interval seconds inside interval", nInterval)                                        
                        clientGeoData.call(this, "multiple");
                        this.emitter.emit("start-reload");
                    }.bind(this), nInterval);  

                } else {

                    this.emitter.emit("start-reload");
                    this.isTracking = !this.isTracking;
                    clearInterval(this.startTrackingInterval);                    

                    console.log("Last position after stop tracking (window.variable)", window.oCurrentPositionObject);

                    window.oCurrentPositionObject.trackingStatus = "stopped";
                    window.oCurrentPositionObject.message = {
                        "title": "Tracking beendet",
                        "text": "",
                        "confirm": false
                    };                    
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

            this.emitter.on("restart-tracking", () => {    
                clearInterval(this.startTrackingInterval);
                this.isTracking = !this.isTracking;   
                console.log("Tracking stopped due to new settings");
                this.onTrackClientsPosition.call(this, true);
            });

            this.emitter.on("close-settings", () => {    
                this.isSettingsOpen = !this.isSettingsOpen; 
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

            <button class="btn btn--icon btn--icon-notext btn--settings" @click="onOpenSettingsDialog">
                <svg class="svgSpriteBox" v-bind:class="{turnSettingsIcon: isSettingsOpen}"><use xlink:href="#settings"></use></svg>
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