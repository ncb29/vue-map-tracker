<script>
  export default {       
      el: '#footer',
      name: "Footer",
      methods: {
          // getClientsGeoDataFooter() {
              
          // }
      },
      data() {
          return {
              renderFooter: true,
          };
      },
      created: function () {
        // this.getClientsGeoDataFooter.call(this);
      },
      mounted() {
          const that = this;        

          this.emitter.on("update-components", () => {                     
              parseFooterContent.call(that);
          });

          parseFooterContent.call(this);

          function parseFooterContent() {
              let oCurrentPosition =  window.localStorage.getItem("ClientsCurrentPosition")      
              oCurrentPosition = JSON.parse(oCurrentPosition);
              console.log("Local Storage Item", oCurrentPosition);
              this.$el.innerHTML = "<p>"+oCurrentPosition.latitude+" - "+oCurrentPosition.longitude+"</p> <p>Genauigkeit: "+oCurrentPosition.accuracy+" Meter</p>";
              this.$forceUpdate();
          }          
      }
  }
</script>

<template>
    <div class="app__main-container--footer" id="footer" v-if="renderFooter">0</div >
</template>