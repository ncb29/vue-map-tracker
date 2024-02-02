<script>
    // import { ref } from 'vue'

    export default {       
        el: '#footer',
        name: "Footer",
        methods: {

        },
        data: () => ({
            renderFooter: true,
        }),
        created: function () {

        },
        mounted() {

            this.emitter.on("update-components", () => {                     
                renderFooterContent.call(this);
            });

            function renderFooterContent() {
                let oStoredCurrentPosition = JSON.parse( window.localStorage.getItem("ClientsCurrentPosition"));

                if (oStoredCurrentPosition !== null && (Object.keys(oStoredCurrentPosition).length !== 0 && oStoredCurrentPosition.constructor === Object)) {

                    const footerInnerHTML = "<p>"+oStoredCurrentPosition.latitude+" - "+oStoredCurrentPosition.longitude+"</p> <p>Genauigkeit: "+oStoredCurrentPosition.accuracy+" Meter</p>";

                    if (oStoredCurrentPosition.message === "") {
                        this.$el.childNodes[0].innerHTML = footerInnerHTML; 
                        // this.$el.childNodes[1].innerHTML = ""; 
                    } else {
                        // If error message exist render it in message box
                        this.$el.childNodes[0].innerHTML = footerInnerHTML; 
                        // this.$el.childNodes[1].innerHTML = oStoredCurrentPosition.message; 
                    }
                    
                } else {
                    // Set fallback geo data
                    this.$el.childNodes[0].innerHTML = "<p>53.5560767 - 9.9284123</p> <p>Genauigkeit: 0 Meter</p>";
                }   
                console.log("FOOTER COMPONENT Local Storage Item", oStoredCurrentPosition);                
                this.$forceUpdate();
            }          
        }
    }
</script>

<template>
    <div class="app__main-container--footer" id="footer" v-if="renderFooter">
        <div class="app__main-container--footer-geoData">0</div>
        <!-- <div class="app__main-container--footer-messages">0</div> -->
    </div>
</template>