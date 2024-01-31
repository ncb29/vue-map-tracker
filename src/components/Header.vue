<script>
    import { clientGeoData }  from './ClientsGeoData.js'
    import axios from "axios";

    export default {
        el: '#header',
        name: "Header",
        methods: {
            clientGeoData,
            
            async onGetClientsPosition() {
                const response = await axios.get(clientGeoData());
                // update map and footer component
                this.emitter.emit("update-components");
                return await response.data;               
            },

            async onAwaitClientsPosition () {
                await this.onGetClientsPosition();
            }
        },        
        mounted() {
        
        }
    }
</script>

<template>
    <div class="app__main-container--header" id="header">
        <h3>OpenStreetMap-Tracker</h3>
        <button @click="onAwaitClientsPosition">Aktualisieren</button>
    </div>
</template>