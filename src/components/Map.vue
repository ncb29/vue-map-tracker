<script>
    import { ref } from 'vue'
    import "leaflet/dist/leaflet.css";
    import L from "leaflet";
    import { icon, Marker } from 'leaflet';
    import MarkerIcon from '../assets/icons/marker-icon-2x.png'

    export default {
        el: '#mapContainer',
        name: "Map",
        data: () => ({ 
            map: null,
            latlng: [],
            renderMap: true,
            isReloading: true,
            isWithMessage: false
        }),
        methods: {

            getReloadGif() {
                if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
                    return new URL(`../assets/gifs/reload-spinner.gif`, import.meta.url).href
                } else {
                    return new URL(`/map-tracker/reload-spinner.gif`, import.meta.url).href
                }           
            }
        },
        created: function () {

        },
        mounted() {
            
            this.emitter.on("start-reload", () => {    
                this.isReloading = !this.isReloading;  
            });

            this.emitter.on("update-components", () => {    
                renderMap.call(this);  
            });

            function renderMap() {

                const iconRetinaUrl = MarkerIcon;
                const iconDefault = icon({
                iconRetinaUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41]
                });
                Marker.prototype.options.icon = iconDefault;

                setTimeout(function () {

                    this.latlng = [];                      
                    let oStoredCurrentPosition = JSON.parse(window.localStorage.getItem("ClientsCurrentPosition"));

                    if (oStoredCurrentPosition !== null && (Object.keys(oStoredCurrentPosition).length !== 0 && oStoredCurrentPosition.constructor === Object)) {

                        this.latlng = [''+oStoredCurrentPosition.latitude+'', ''+oStoredCurrentPosition.longitude+'']; 
                        
                        if (oStoredCurrentPosition.message !== "") {
                            this.isWithMessage = !this.isWithMessage; 
                            this.$el.childNodes[1].innerHTML = oStoredCurrentPosition.message;  

                            setTimeout(function () {
                                this.isWithMessage = !this.isWithMessage; 
                            }.bind(this), 5000);  
                        }
                    } else {
                        // Set fallback geo data
                        this.latlng = ['53.5560767', '9.9284123']; 
                    }                 

                    if (this.latlng) {
                        if (!this.map) {
                            this.map = L.map("mapContainer", {
                                center: this.latlng,
                                zoom: 18,
                            });
                            L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
                                maxNativeZoom: 18,
                                maxZoom: 18,
                            }).addTo(this.map);

                            // Set a marker to map (current client position)
                            new L.Marker(this.latlng).addTo(this.map);
                            this.isReloading = !this.isReloading;  

                            console.log("MAP COMPONENT this.latlng", this.latlng)
                        } else {
                            // Set a new center and marker to map (current client position)
                            this.map.panTo(new L.LatLng(this.latlng[0], this.latlng[1]));
                            new L.Marker(this.latlng).addTo(this.map);
                            this.isReloading = !this.isReloading;  

                            console.log("MAP COMPONENT this.latlng", this.latlng)
                        }                 
                    }              
                }.bind(this), 500);  
            }             
        },
        beforeMount() {
        },
        beforeDestroy() {
            if (this.map) {
                this.map.remove();
            }
        },     
    
    };
</script>

<template>
   <div class="app__main-container--map" id="mapContainer" v-if="renderMap">
        <div class="reloadComponent" v-bind:class="{reloadComponentShow: isReloading}">
            <img :src="getReloadGif()" alt="" class="reloadComponent--gif">            
        </div>
        <div class="messageBox" v-bind:class="{messageBoxShow: isWithMessage}"></div>
   </div>
</template>