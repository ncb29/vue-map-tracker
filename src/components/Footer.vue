<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {       
        el: '#footer',
        name: "Footer",
        methods: {
            clientGeoData,
            // getClientsGeoDataFooter() {
                
            // }
        },
        data() {
            return {
                renderFooter: true,
            };
        },
        created: function () {
            clientGeoData();
            // this.getClientsGeoDataFooter.call(this);
        },
        mounted() {
            const that = this;        

            this.emitter.on("update-components", () => {                     
                setTimeout(function () {
                    parseFooterContent.call(that);
                }.bind(this), 1000);
            });

            setTimeout(function () {
                parseFooterContent.call(this);
            }.bind(this), 1000);  

            function parseFooterContent() {
                let oCurrentPosition =  window.localStorage.getItem("ClientsCurrentPosition")      
                oCurrentPosition = JSON.parse(oCurrentPosition);
                console.log("FOOTER COMPONENT Local Storage Item", oCurrentPosition);
                this.$el.innerHTML = "<p>"+oCurrentPosition.latitude+" - "+oCurrentPosition.longitude+"</p> <p>Genauigkeit: "+oCurrentPosition.accuracy+" Meter</p>";
                this.$forceUpdate();
            }          
        }
    }
</script>

<template>
    <div class="app__main-container--footer" id="footer" v-if="renderFooter">0</div >
</template>