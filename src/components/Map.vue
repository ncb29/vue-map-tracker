<template>
    <div class="map__container" id="mapContainer"></div>
</template>

<script>
    import { ref } from 'vue'
    import "leaflet/dist/leaflet.css";
    import L from "leaflet";
    import { icon, Marker } from 'leaflet';
    import MarkerIcon from '../assets/marker-icon-2x.png'

    export default {
      name: "Map",
      data: () => ({ 
          map: null,
          latlng: []
      }),
      methods: {

          getLatLng: function () {

            this.latlng = [];
                      
            const successCallback = (position) => {
              const { latitude, longitude } = position.coords;              
              this.latlng = [''+latitude+'', ''+longitude+''];
            };

            const errorCallback = (error) => {
              console.log(error);
            };

            navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );                
              
          }
      },
      created: function () {
          this.getLatLng.call(this);
      },
      mounted() {
          this.getLatLng.call(this);

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
            if(this.latlng) {
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
            }              
          }.bind(this), 1500);    
          
      },
      beforeDestroy() {
          if (this.map) {
              this.map.remove();
          }
      },     
    
    };
</script>
