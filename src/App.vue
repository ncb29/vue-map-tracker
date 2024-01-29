<script setup>
import { ref } from 'vue'
import Map from './components/Map.vue'
import Footer from './components/Footer.vue'
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
      display: flex;
      flex-direction: column;
  }

  .map__container {
      width: 100%;
      height: 100%;
  }

  .app__main-container--footer {
    width: 100%;
    height: 70px;
    z-index: 9999;
    background: #758484;
    color: #fff;
    padding: 10px;
    position: fixed;
    bottom: 0px;
  }
</style>
