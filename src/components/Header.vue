<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {
        el: '#header',
        name: "Header",
        methods: {
            clientGeoData,

            onGetClientsPosition() {
                clientGeoData.call(this);     
            }
        },      
        created: function () {
            clientGeoData.call(this);
        },  
        mounted() {
        
        }
    }
</script>

<template>
    <div class="app__main-container--header" id="header">
        <h3>OpenStreetMap-Tracker</h3>
        <button @click="onGetClientsPosition">Aktualisieren</button>
    </div>
</template>