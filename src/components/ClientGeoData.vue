<!-- <script>
    import { ref } from 'vue';

    export default {
        name: 'ClientsGeoData',
        data() {
            return {
                group: ''
            }
        },
        methods:{
            getClientGeoData() {
                // navigator.geolocation.getCurrentPosition(show_map(), handle_error(), {enableHighAccuracy: true});
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    console.log("LNG LAT", latitude, longitude)
                    // Show a map centered at latitude / longitude.
                    return latitude;
                });
                
            },

            handle_error(err) {
                if (err.code == 1) {
                    // user said no!
                }
            },

            show_map(position) {
                var oClientsPositionData = position.coords;
                console.log("LAT LNG", oClientsPositionData); 
                
                return oClientsPositionData.latitude;
            }
        },
        created:function(){
            this.getClientGeoData();
        },
    };

    // getClientGeoData();

    
  
</script> -->

<!-- <template>
  <div >
    <button @click='getClientGeoData(latitude)'>Get Data{{ latitude }}</button>
  </div>
</template> -->




<script>

export default {
  
    mounted() {
        getClientGeoData.call(this);

        function getClientGeoData() {
            // navigator.geolocation.getCurrentPosition(show_map(), handle_error(), {enableHighAccuracy: true});
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                console.log("LNG LAT Accuracy", latitude, longitude, position.coords.accuracy)
                // Show a map centered at latitude / longitude.
                console.log(this.$el.textContent) // I'm text inside the component.
                this.$el.textContent = ""+latitude+" - "+longitude+"";
            });           

        };

        function handle_error(err) {
            if (err.code == 1) {
            // user said no!
            }
        };

        function show_map(position) {
            var oClientsPositionData = position.coords;
            console.log("LAT LNG", oClientsPositionData); 

            return oClientsPositionData.latitude;
        }
    }
}
</script>

<template>
    <div class="app__main-container--footer">0</div >
</template>