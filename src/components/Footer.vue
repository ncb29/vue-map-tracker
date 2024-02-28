<script>
   
    export default {   

        el: '#footer',
        name: 'Footer',    

        data: () => ({
            renderFooter: true,
        }),

        methods: {

        },

        created() {

        },

        mounted() {


            this.emitter.on( 'start-tracking', () => {    

                if ( this.startTrackingCounter ) {
                    clearInterval( this.startTrackingCounter );
                }

            });


            this.emitter.on( 'end-tracking', ( oPositionObject ) => {                     
                renderFooterContent.call( this, oPositionObject) ;
            });


            function renderFooterContent( oPositionObject ) {

                if ( oPositionObject !== null && Object.keys( oPositionObject ).length !== 0 ) {

                    const fixedLatitude = oPositionObject.latitude.toFixed(3);
                    const fixedLongitude = oPositionObject.longitude.toFixed(3);

                    const footerInnerHTML = '<p>Lat: '+fixedLatitude+' / Lng: '+fixedLongitude+'</p><p>Präzision: '+oPositionObject.accuracy+' Meter</p>';


                    if ( Object.keys( oPositionObject.message ).length !== 0 && oPositionObject.message.constructor === Object ) {

                        this.$refs.footerMessage.innerHTML = '<p>Letzter Status:</p>' + '<p>'+oPositionObject.message.title+'</p>';

                    } else {

                        this.$refs.footerMessage.innerHTML = '';
                    }
                    

                    if ( (oPositionObject.trackingType === 'multiple' || oPositionObject.trackingType === 'multiple-initial' ) && oPositionObject.trackingStatus !== 'stopped' ) {

                        const storedInterval = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                        if ( storedInterval !== null ) {
                                
                            if ( storedInterval.valueInSec !== '' ) {
                                
                                var i = storedInterval.valueInSec;
                                
                                this.startTrackingCounter = setInterval(

                                    function() { 
                                        i--;

                                        if ( i > 0 ) {
                                            this.$refs.footerSecondInterval.innerHTML = '<p>Ortung in: '+i+' Sek.</p>' ;
                                        } else {
                                            this.$refs.footerSecondInterval.innerHTML = '' ;
                                        }           

                                    }.bind( this ),

                                1000); 

                            }     

                        } else {

                            this.$refs.footerSecondInterval.innerHTML = '';
                        }
                    } else {

                        clearInterval( this.startTrackingCounter );
                        this.$refs.footerSecondInterval.innerHTML = '';
                    }                   

                    this.$refs.footerGeoData.innerHTML = footerInnerHTML; 
                    
                } else {
                    
                    // Set fallback geo data
                    this.$refs.footerGeoData.innerHTML = '<p>00.00 - 00.00</p> <p>Präzision: 0 Meter</p>';
                }   

                this.$forceUpdate();
            }          
        }
    }
</script>

<template>
    <div class='app__main-container--footer' id='footer' v-if='renderFooter'>
        <div class='app__main-container--footer-geoData' ref='footerGeoData'></div>
        <div class='app__main-container--footer-status'>
            <div class='app__main-container--footer-status--message' ref='footerMessage'></div>
            <div class='app__main-container--footer-status--interval' ref='footerSecondInterval'></div>
        </div>
    </div>
</template>