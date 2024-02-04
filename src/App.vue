<script>
    import { ref } from 'vue'
    import SvgSprite from './components/SvgSprite.vue'  
    import Header from './components/Header.vue'
    import Map from './components/Map.vue'
    import Footer from './components/Footer.vue'
    import SettingsDialog from './components/SettingsDialog.vue'   

    export default {
        name: 'App',
        components: {
            Header,
            Map,
            Footer,
            SvgSprite,
            SettingsDialog,
        },
    };
</script>

<template>
    <SvgSprite />
    <Header></Header>
    <Map></Map>
    <Footer></Footer>
    <SettingsDialog></SettingsDialog>
</template>


<style>
     :root {
        --componentsBackground: #391616;
        --mainFontColor: #f9f9f9;
        --layoutPadding: 15px;
    }

    html,
    body {
        font-family: "Ubuntu", sans-serif;
        font-stretch: expanded;
    }

    @media (max-width: 576px) {
        h2 {
            font-size: 1.1rem;
            font-weight: 600;
        }
    }   

    .btn {
        padding: 2px;
        background: transparent;
        padding: 0;
        border: none;
        font: inherit;
        color: inherit;
        background-color: transparent;
        cursor: pointer;
    }

    .btn--icon {
        position: relative;
        display: flex;  
        flex-direction: row;
        align-items: center;
    }

    .btn--icon,
    .btn--icon .svgSpriteBox {
        -webkit-transition-duration: .8s;
        -o-transition-duration: .8s;
        transition-duration: .8s;
        -webkit-transition-property: all;
        -o-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
    }

    .btn--icon .svgSpriteBox {
        max-height: 25px;
        max-width: 30px;
        margin-right: 10px;        
    }

    .btn--icon-notext .svgSpriteBox {
        margin-right: 0px;
    }

    .svgSpriteBox {
        fill: #fff;
    }

    .btn--icon.active,
    .btn--icon.active .svgSpriteBox {
        /* animation: btnIconActive 2s infinite; */
    }

    .btn--icon.active .svgSpriteBox {
        transform: scale(1.15);
        animation: btnIconActive 3s infinite;
    }

    @keyframes btnIconActive {
        0% {   
            fill: #0f5f07;
            transform: scale(1.3);
        }
        50% {   
            fill: #970909;
            transform: scale(1.15);
            }
        100% {   
            fill: #0f5f07;
            transform: scale(1.3);
        }
    } 

    .btnHide {
        display: none;
    }

    .btnShow {
        display: flex !important;
    }
    
    .radioButton {
        width: 2.5em;
        height: 2.5em;
        outline: none;
        appearance: none;
        border: solid 2px #333;
        border-radius: 50%;
        background: #fff;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .radioButton::after {
        content: "\25C9";
        width: auto;
        height: auto;        
        color: var(--componentsBackground);
        font-size: 0rem;
        position: relative;
        top: 1px;
        transition: .5s all ease;
    }

    .radioButton:checked::after {
        font-size: 1.8rem;
    }

    label {
        font-size: .9rem;
    }

    #app.app__main-container {
        width: 100%;
        height: 100vh;
        max-height: 100vh;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        color:var(--mainFontColor);
    }

    .app__main-container--header {
        width: 100%;
        height: auto;
        background: var(--componentsBackground);
        padding: var(--layoutPadding);
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 99999;
    }

    .app__main-container--header-firstrow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .app__main-container--header-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        max-width: 90%;
    }

    .app__main-container--header-logo {
        height: 40px;
        width: 40px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .app__main-container--header-logo svg {
        height: 100%;
        width: 100%;
    }

    @media (max-width: 576px) {
        .app__main-container--header-logo svg {
            margin-right: 0px;
        }
    }   

    .app__main-container--header-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin: 20px 0 5px 0;
    }    

    .app__main-container--header-buttons .btn:first-child {
        margin-right: 25px;
    }

    .app__main-container--map {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .app__main-container--footer {
        width: 100%;
        height: auto;
        z-index: 9999;
        background: var(--componentsBackground);
        padding: var(--layoutPadding);
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
        display: flex;
        flex-direction: column;
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
        transform: translate(-50%, calc(-25% - 50px));
    }

    .messageBox {
        width: auto;
        min-width: 80vw;
        height: auto;
        min-height: 150px;
        color: #fff;
        background: var(--componentsBackground);
        border-radius: 8px;
        padding: 20px;
        font-size: 1.4em;
        position: absolute;
        top: -500px;
        left: 50%;
        transform: translate(-50%, calc(-25% - 90px));
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-transition-duration: .8s;
        -o-transition-duration: .8s;
        transition-duration: .8s;
        -webkit-transition-property: all;
        -o-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
        box-shadow: -1px 2px 12px 9px rgba(299, 299, 299, .8);
    }

    .messageBoxShow {
        top: 50%;   
    }

    .app__main-container--settingsDialog {
        width: auto;
        min-width: 80vw;
        height: auto;
        min-height: 150px;
        color: #fff;
        background: var(--componentsBackground);
        border-radius: 8px;
        padding: 25px;
        font-size: 1.4em;
        position: absolute;
        top: -500px;
        left: 50%;
        z-index: 9999;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        -webkit-transition-duration: .8s;
        -o-transition-duration: .8s;
        transition-duration: .8s;
        -webkit-transition-property: all;
        -o-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: ease;
        -o-transition-timing-function: ease;
        transition-timing-function: ease;
        box-shadow: -1px 2px 12px 9px rgba(299, 299, 299, .8);
    }

    .showSettingsDialog {
        top: 50%;
    }

    .app__main-container--settingsDialog-List-Title {
        font-size: .8rem;
        margin: 25px 0 10px 0;
    }

    .app__main-container--settingsDialog-List {
        border-top: solid .1em #fff;
        list-style-type: none;
        padding: 15px 0 0 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .app__main-container--settingsDialog-List li {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0 0 20px 0;
    }

    .app__main-container--settingsDialog-List li .radioButton {
        margin-right: 15px;
    }

    
</style>
