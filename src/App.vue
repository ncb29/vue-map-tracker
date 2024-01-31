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
      position: relative;
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

  /* Custom */
  .reloadComponent {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .7);
    opacity: 0;
    -webkit-transition-duration: .5s;
    -o-transition-duration: .5s;
    transition-duration: .5s;
    -webkit-transition-property: opacity;
    -o-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease;
    -o-transition-timing-function: ease;
    transition-timing-function: ease;
  }

  .reloadComponent::after {
     content: "";
     background-image: url(./assets/gifs/reload-spinner.gif);
     background-size: 100%;
     width: 50px;
     height: 50px;
     position: absolute;
     top: calc(50% - 50px);
     left: 50%;
  }

  .reloadComponentShow {
    z-index: 9999;
    opacity: 1;
    
  }
</style>
