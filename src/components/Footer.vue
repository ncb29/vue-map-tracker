<script>

export default {
        
    mounted() {
        callClientGeoData.call(this);

        function callClientGeoData() {
          let oCurrentPosition =  window.localStorage.getItem("ClientsCurrentPosition")      
          oCurrentPosition = JSON.parse(oCurrentPosition);
          console.log("Local Storage Item in Footer", oCurrentPosition)

          this.$el.innerHTML = "<p>"+oCurrentPosition.latitude+" - "+oCurrentPosition.longitude+"</p> <p>Genauigkeit: "+oCurrentPosition.accuracy+" Meter</p>";
        };
    }
}
</script>

<template>
    <div class="app__main-container--footer">0</div >
</template>