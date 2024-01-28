<script>
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

  export default {
    components: {
      LMap,
      LTileLayer,
    },
    data() {
      return {
        zoom: 2,
      };
    },
  };
</script>

<template>
  <div class="map__container">
    <l-map :use-global-leaflet="false" ref="map" v-model:zoom="zoom" :center="[47.41322, -1.219482]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>
</template>

<style>
#app.app__main-container {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
}
.map__container {
  width: 100%;
  height: 100%;
}
</style>
