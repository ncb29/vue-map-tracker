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
     :root {
      --componentsBackground: #391616;
      --mainFontColor: #f9f9f9;
    }

    html,
    body {
      font-family: "Verdana", sans-serif;
    }

    @media (max-width: 576px) {
        h2 {
          font-size: 1rem;
        }
    }   

    .btn {
      padding: 2px;
    }

    .btnHide {
      display: none;
    }

    .btnShow {
      display: block !important;
    }

    #app.app__main-container {
        width: 100%;
        height: 100vh;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        color:var(--mainFontColor);
    }

    .app__main-container--header {
        width: 100%;
        height: 80px;
        background: var(--componentsBackground);
        padding: 10px 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .app__main-container--header-title {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .app__main-container--header-logo svg {
        height: 45px;
        margin-left: -20px;
        margin-right: 10px;
    }

    @media (max-width: 576px) {
        .app__main-container--header-logo svg {
            margin-right: 0px;
        }
    }   

    .app__main-container--header-buttons {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }    

    .app__main-container--header-buttons .btn:first-child {
        margin-bottom: 10px;
    }

    .app__main-container--map {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .app__main-container--footer {
        width: 100%;
        height: 75px;
        max-height: 75px;
        z-index: 9999;
        background: var(--componentsBackground);
        padding: 8px 15px;
        position: fixed;
        bottom: 0px;
        font-size: .8rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    /* .app__main-container--footer-geoData,
    .app__main-container--footer-messages {
        border: solid .1em #fff;
        padding: 8px;
    } */

    .app__main-container--footer-geoData {
        width: 100%;
    }

    /* .app__main-container--footer-messages {
        width: 50%;
    } */

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
        -webkit-transition-duration: .8s;
        -o-transition-duration: .8s;
        transition-duration: .8s;
        -webkit-transition-property: opacity;
        -o-transition-property: opacity;
        transition-property: opacity;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
    }  
    
    .reloadComponentShow {
        z-index: 9999;
        opacity: 1;      
    }

    .reloadComponent--gif {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -75%);
    }

    .messageBox {
        width: auto;
        min-width: 60vw;
        height: auto;
        min-height: 80px;
        color: #333;
        background: #fff;
        border: solid .11em #333;
        border-radius: 3px;
        padding: 20px;
        font-size: 1.4em;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -75%);
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-transition-duration: .8s;
        -o-transition-duration: .8s;
        transition-duration: .8s;
        -webkit-transition-property: opacity;
        -o-transition-property: opacity;
        transition-property: opacity;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
    }

    .messageBoxShow {
        z-index: 9999;
        opacity: 1;        
    }

    
</style>
