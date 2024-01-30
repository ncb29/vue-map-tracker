<script>
    import { ref } from 'vue'
    import "leaflet/dist/leaflet.css";
    import L from "leaflet";
    import { clientGeoData }  from './ClientsGeoData.js'
    import { icon, Marker } from 'leaflet';
    import MarkerIcon from '../assets/marker-icon-2x.png'

    export default {
      el: '#mapContainer',
      name: "Map",
      data: () => ({ 
          map: null,
          latlng: [],
          renderMap: true,
      }),
      methods: {
          clientGeoData,
      },
      created: function () {
          clientGeoData();
      },
      mounted() {
        const that = this;        

        this.emitter.on("update-components", () => {                     
            parseMap.call(that);
        });

        parseMap.call(this);

        function parseMap() {
  
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
              let oCurrentPosition =  window.localStorage.getItem("ClientsCurrentPosition");

              oCurrentPosition = JSON.parse(oCurrentPosition);            
              this.latlng = [''+oCurrentPosition.latitude+'', ''+oCurrentPosition.longitude+''];     

              console.log("MAP COMPONENT this.latlng", this.latlng)

              if (this.latlng) {
                  if (!this.map) {
                      this.map = L.map("mapContainer", {
                          center: this.latlng,
                          zoom: 20,
                      });
                      L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                          attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
                          maxNativeZoom:19,
                          maxZoom: 25
                      }).addTo(this.map);

                      // Set a marker to map (current client position)
                      new L.Marker(this.latlng).addTo(this.map);
                  } else {
                     // Set a new center and marker to map (current client position)
                      this.map.panTo(new L.LatLng(this.latlng[0], this.latlng[1]));
                      new L.Marker(this.latlng).addTo(this.map);
                  }                 
              }              
            }.bind(this), 1000);  
        }      
      },
      beforeDestroy() {
          if (this.map) {
              this.map.remove();
          }
      },     
    
    };
</script>

<template>
   <div class="app__main-container--map" id="mapContainer" v-if="renderMap"></div>
</template>