<template>
    <div class="map__container" id="mapContainer"></div>
</template>

<script>
    import { ref } from 'vue'
    import "leaflet/dist/leaflet.css";
    import L from "leaflet";

    export default {
      name: "Map",
      data: () => ({ 
          map: null,
          latlng: []
      }),
      methods: {

          getLatLng: function () {
                      
            const successCallback = (position) => {
              const { latitude, longitude } = position.coords;
              console.log("LNG LAT Accuracy", latitude, longitude, position.coords.accuracy)
              // Show a map centered at latitude / longitude.
              
              this.latlng = [''+latitude+'', ''+longitude+''];
            };

            const errorCallback = (error) => {
              console.log(error);
            };

            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);                
              
          }
      },
      created: function () {
          this.getLatLng.call(this);
      },
      mounted() {
          this.getLatLng.call(this);

          setTimeout(function () {
              this.map = L.map("mapContainer", {
                center: this.latlng,
                zoom: 20,
              });
              L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
                  maxNativeZoom:19,
                  maxZoom: 25
              }).addTo(this.map);
          }.bind(this), 1200);    
          
      },
      beforeDestroy() {
          if (this.map) {
              this.map.remove();
          }
      },     
    
    };
</script>
