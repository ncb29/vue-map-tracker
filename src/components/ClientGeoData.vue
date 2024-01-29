<script>

export default {
  
    mounted() {
        getClientGeoData.call(this);

        function getClientGeoData() {

            const successCallback = (position) => {
              const { latitude, longitude } = position.coords;
              let accuracy = position.coords.accuracy;
              let fixedAccuracy = accuracy.toFixed(2);
              console.log("LNG, LAT, Accuracy", latitude, longitude, fixedAccuracy)
              console.log("Position Object",  position.coords)
              
              console.log(this.$el.textContent) // I'm text inside the component.
              this.$el.innerHTML = "<p>"+latitude+" - "+longitude+"</p> <p>Genauigkeit: "+fixedAccuracy+" Meter</p>";
            };

            const errorCallback = (error) => {
                if (error.code == 1) {
                    this.$el.textContent = "No Permission"
                }
            };

            navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );            

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