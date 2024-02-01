<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {       
        el: '#footer',
        name: "Footer",
        methods: {
            clientGeoData,
        },
        data() {
            return {
                renderFooter: true,
            };
        },
        created: function () {
            clientGeoData.call(this);
        },
        mounted() {
            const that = this;        

            this.emitter.on("update-components", () => {                     
                parseFooterContent.call(that);
            });

            parseFooterContent.call(this);

            function parseFooterContent() {
                let oStoredCurrentPosition = JSON.parse( window.localStorage.getItem("ClientsCurrentPosition"));

                if (oStoredCurrentPosition !== null && (Object.keys(oStoredCurrentPosition).length !== 0 && oStoredCurrentPosition.constructor === Object)) {
                    this.$el.innerHTML = "<p>"+oStoredCurrentPosition.latitude+" - "+oStoredCurrentPosition.longitude+"</p> <p>Genauigkeit: "+oStoredCurrentPosition.accuracy+" Meter</p>"; 
                } else {
                    // Set fallback geo data
                    this.$el.innerHTML = "<p>53.5560767 - 9.9284123</p> <p>Genauigkeit: 0 Meter</p>";
                }   
                console.log("FOOTER COMPONENT Local Storage Item", oStoredCurrentPosition);                
                this.$forceUpdate();
            }          
        }
    }
</script>

<template>
    <div class="app__main-container--footer" id="footer" v-if="renderFooter">0</div >
</template>