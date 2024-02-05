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

                if ( oPositionObject !== null && (Object.keys( oPositionObject ).length !== 0 && oPositionObject.constructor === Object ) ) {

                    const footerInnerHTML = '<p>Lat: '+oPositionObject.latitude+'</p> <p>Lng: '+oPositionObject.longitude+'</p> <p>Präzision: '+oPositionObject.accuracy+' Meter</p>';

                    if ( Object.keys( oPositionObject.message ).length !== 0 && oPositionObject.message.constructor === Object ) {
                        this.$el.childNodes[1].childNodes[0].innerHTML = '<p>Letzter Status:</p>' + '<p>'+oPositionObject.message.title+'</p>';
                    } else {
                        this.$el.childNodes[1].childNodes[0].innerHTML = '';
                    }

                    if ( oPositionObject.trackingType === 'multiple' && oPositionObject.trackingStatus !== 'stopped' ) {

                        const storedInterval = JSON.parse( window.localStorage.getItem( 'SelectedTrackingInterval' ) );

                        if ( storedInterval !== null ) {
                                
                            if ( storedInterval.value !== '' ) {

                                // Use only two first digits of interval value for seconds counter
                                // Before check if value has more then 4 digits. If true then keep 2 digits else keep 1 one digit (e.g 5sec)
                                let sIntervalValue = storedInterval.value.toString().length;

                                if ( sIntervalValue > 4 ) {
                                    var i = storedInterval.value.substring( 0, 2 );
                                } else {
                                    var i = storedInterval.value.substring( 0, 1 );
                                }   

                                this.startTrackingCounter = setInterval(
                                    function() { 
                                        i--;
                                        if ( i > 0 ) {
                                            this.$el.childNodes[1].childNodes[1].innerHTML = '<p>Ortung in: '+i+' Sek.</p>' ;
                                        } else {
                                            this.$el.childNodes[1].childNodes[1].innerHTML = '' ;
                                        }                                        
                                    }.bind( this )
                                , 1000); 

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
                console.log( 'FOOTER COMPONENT Local Storage Item', oPositionObject );                
                this.$forceUpdate();
            }          
        }
    }
</script>

<template>
    <div class='app__main-container--footer' id='footer' v-if='renderFooter'>
        <div class='app__main-container--footer-geoData'>0</div>
        <div class='app__main-container--footer-status'>
            <div class='app__main-container--footer-status--message'></div>
            <div class='app__main-container--footer-status--interval'></div>
        </div>
    </div>
</template>