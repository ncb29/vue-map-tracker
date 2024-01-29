<script setup>
import { ref } from 'vue'
import Map from './components/Map.vue'
import Footer from './components/ClientGeoData.vue'
</script>

<template>
  <Map></Map>
  <Footer></Footer>
</template>


<style>
  #app.app__main-container {
      width: 100%;
      height: 100vh;
      padding: 0;
      margin: 0;
      position: relative;
      display: flex;
      flex-direction: column;
  }

  .map__container {
      width: 100%;
      height: calc(100% - 40px);
  }

  .app__main-container--footer {
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background: #758484;
    color: #fff;
  }
</style>
