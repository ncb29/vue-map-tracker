<script>
   
    export default {   

        el: '#footer',
        name: 'Footer',    

        data: () => ({
            renderFooter: true,
        }),

        methods: {

        },

        created () {

        },

        mounted () {


            this.emitter.on( 'start-tracking', () => {    

                if ( this.startTrackingCounter ) {
                    clearInterval( this.startTrackingCounter );
                }

            });


            this.emitter.on( 'end-tracking', ( oTrackedPosition ) => {                     
                renderFooterContent.call( this, oTrackedPosition) ;
            });


            function renderFooterContent ( oTrackedPosition ) {

                if ( oTrackedPosition !== null && Object.keys( oTrackedPosition ).length !== 0 ) {

                    const fixedLatitude = oTrackedPosition.latitude.toFixed(3);
                    const fixedLongitude = oTrackedPosition.longitude.toFixed(3);

                    const footerInnerHTML = '<p>Lat: '+fixedLatitude+' / Lng: '+fixedLongitude+'</p><p>Präzision: '+oTrackedPosition.accuracy+' Meter</p>';


                    if ( Object.keys( oTrackedPosition.message ).length !== 0 && oTrackedPosition.message.constructor === Object ) {

                        this.$refs.footerMessage.innerHTML = '<p>Letzter Status:</p>' + '<p>'+oTrackedPosition.message.title+'</p>';

                    } else {

                        this.$refs.footerMessage.innerHTML = '';
                    }
                    

                    if ( (oTrackedPosition.trackingType === 'multiple' || oTrackedPosition.trackingType === 'multiple-initial' ) && oTrackedPosition.trackingStatus !== 'stopped' ) {

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