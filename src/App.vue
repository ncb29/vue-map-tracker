<script setup>
  import { ref } from 'vue'
  import Header from './components/Header.vue'
  import Map from './components/Map.vue'
  import Footer from './components/Footer.vue'
</script>

<template>
  <Header></Header>
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
      color: #fff;
  }

  .app__main-container--header {
    width: 100%;
    height: 50px;
    background: #7e7e7e;
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .app__main-container--map {
      width: 100%;
      height: 100%;
  }

  .app__main-container--footer {
    width: 100%;
    height: 70px;
    z-index: 9999;
    background: #7e7e7e;
    padding: 10px 20px;
    position: fixed;
    bottom: 0px;
  }
</style>
