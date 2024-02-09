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

            this.emitter.on( 'start-reload', () => {    
                if ( this.startTrackingCounter ) {
                    clearInterval( this.startTrackingCounter );
                }  
            });

            this.emitter.on( 'update-components', ( oPositionObject ) => {                     
                renderFooterContent.call( this, oPositionObject) ;
            });

            function renderFooterContent( oPositionObject ) {

                if ( oPositionObject !== null && Object.keys( oPositionObject ).length !== 0 ) {

                    const footerInnerHTML = '<p>Lat: '+oPositionObject.latitude+'</p> <p>Lng: '+oPositionObject.longitude+'</p> <p>Präzision: '+oPositionObject.accuracy+' Meter</p>';

                    if ( Object.keys( oPositionObject.message ).length !== 0 && oPositionObject.message.constructor === Object ) {
                        this.$el.childNodes[1].childNodes[0].innerHTML = '<p>Letzter Status:</p>' + '<p>'+oPositionObject.message.title+'</p>';
                    } else {
                        this.$el.childNodes[1].childNodes[0].innerHTML = '';
                    }

                    if ( (oPositionObject.trackingType === 'multiple' || oPositionObject.trackingType === 'multiple-initial' ) && oPositionObject.trackingStatus !== 'stopped' ) {

                        const storedInterval = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                        if ( storedInterval !== null ) {
                                
                            if ( storedInterval.valueInSec !== '' ) {
                                
                                var i = storedInterval.valueInSec;
                                
                                this.startTrackingCounter = setInterval(
                                    function() { 
                                        i--;
                                        if ( i > -1 ) {
                                            this.$el.childNodes[1].childNodes[1].innerHTML = '<p>Ortung in: '+i+' Sek.</p>' ;
                                        } else {
                                            this.$el.childNodes[1].childNodes[1].innerHTML = '' ;
                                        }                                        
                                    }.bind( this ),
                                1000); 

                            }     

                        } else {
                            this.$el.childNodes[1].childNodes[1].innerHTML = '';
                        }
                    } else {
                        clearInterval( this.startTrackingCounter );
                        this.$el.childNodes[1].childNodes[1].innerHTML = '';
                    }                   

                    this.$el.childNodes[0].innerHTML = footerInnerHTML; 
                    
                } else {
                    // Set fallback geo data
                    this.$el.childNodes[0].innerHTML = '<p>00.00 - 00.00</p> <p>Präzision: 0 Meter</p>';
                }   

                this.$forceUpdate();
            }          
        }
    }
</script>

<template>
    <div class='app__main-container--footer' id='footer' v-if='renderFooter'>
        <div class='app__main-container--footer-geoData'></div>
        <div class='app__main-container--footer-status'>
            <div class='app__main-container--footer-status--message'></div>
            <div class='app__main-container--footer-status--interval'></div>
        </div>
    </div>
</template>