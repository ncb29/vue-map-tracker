<script>
   
    export default {       
        el: '#footer',
        name: "Footer",
        methods: {

        },
        data: () => ({
            renderFooter: true,
        }),
        created() {

        },
        mounted() {

            this.emitter.on("update-components", (oPositionObject) => {                     
                renderFooterContent.call(this, oPositionObject);
            });

            function renderFooterContent(oPositionObject) {

                if (oPositionObject !== null && (Object.keys(oPositionObject).length !== 0 && oPositionObject.constructor === Object)) {

                    const footerInnerHTML = "<p>Lat: "+oPositionObject.latitude+"</p> <p>Lng: "+oPositionObject.longitude+"</p> <p>Präzision: "+oPositionObject.accuracy+" Meter</p>";

                    if (oPositionObject.message === "") {
                        this.$el.childNodes[0].innerHTML = footerInnerHTML; 
                        // this.$el.childNodes[1].innerHTML = ""; 
                    } else {
                        // If error message exist render it in message box
                        this.$el.childNodes[0].innerHTML = footerInnerHTML; 
                        // this.$el.childNodes[1].innerHTML = oPositionObject.message; 
                    }
                    
                } else {
                    // Set fallback geo data
                    this.$el.childNodes[0].innerHTML = "<p>53.5560767 - 9.9284123</p> <p>Präzision: 0 Meter</p>";
                }   
                console.log("FOOTER COMPONENT Local Storage Item", oPositionObject);                
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