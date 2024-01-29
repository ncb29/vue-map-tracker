<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {
        el: '#header',
        name: "Header",
        methods: {
            clientGeoData,

            onGetClientsPosition() {
                fetch(clientGeoData()).then(async response => {
					try {
						this.emitter.emit("update-components", "ABSSD");  						
						} catch(error) {
						console.error("Error", error)
					}
				});                    
            }
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