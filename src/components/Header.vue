<script>
    import { clientGeoData }  from './ClientsGeoData.js'

    export default {
        el: '#header',
        name: 'Header',
        data: () => ({ 
            isNewPosition: false,
            isCurrentTracking: false,
            isSettingsOpen: false,
            isPositionDisabled: false,
            isStopTracking: false
        }),
        methods: {

            clientGeoData,

            onOpenSettingsDialog() { 
                this.isSettingsOpen = !this.isSettingsOpen; 

                // We need the isCurrentTracking boolean to check if tracking is active when define new interval value.            
                this.emitter.emit( 'open-settings', this.isCurrentTracking );
            },

            onGetClientsPosition() {         
                this.isNewPosition = !this.isNewPosition; 
                this.isPositionDisabled = true; 
                this.emitter.emit( 'start-reload' );               
                clientGeoData.call( this, 'single' );               
            },

            onTrackPosition(bTrackDirectly ) {

                let nInterval;
                const storedInterval = JSON.parse( window.localStorage.getItem( 'SelectedTrackingInterval' ) );

                this.isPositionDisabled = true;

                if ( storedInterval !== null && storedInterval.value !== '' ) {

                    nInterval = storedInterval.value;
                    console.log( 'Current selected interval', nInterval );  

                } else {
                    // Fallback value
                    nInterval = 20000;
                }  

                // First call client geo data directly...
                if ( bTrackDirectly !== false ) {
                    this.isCurrentTracking = !this.isCurrentTracking;
                    clientGeoData.call( this, 'multiple' );
                    this.emitter.emit( 'start-reload' );
                }                    

                // ... then call data by interval
                this.startTrackingInterval = setTimeout(

                    function() { 
                        console.log( 'Current interval seconds inside interval', nInterval )                                        
                        clientGeoData.call( this, 'multiple' );
                        this.emitter.emit( 'start-reload' );
                    }.bind(this),

                nInterval);  

            },

            onStopTracking () {

                this.emitter.emit( 'start-reload' );
                this.isCurrentTracking = !this.isCurrentTracking;
                clearTimeout( this.startTrackingInterval );                     

                let oLastPositionObject = window.oCurrentPositionObject
                console.log( 'Last position after stop tracking (window.variable)', oLastPositionObject );

                oLastPositionObject.trackingStatus = 'stopped';
                oLastPositionObject.message = {
                    'title': 'Tracking beendet',
                    'text': '',
                    'confirm': false,
                };       

                this.emitter.emit( 'update-components', oLastPositionObject );  
            }
        },      
        created() {
            
        },  
        mounted() {
                        
            clientGeoData.call( this , 'initial' );

            this.emitter.on( 'update-components', ( oPositionObject ) => {    

                if ( oPositionObject.trackingType === 'single' ) {

                    setTimeout(function() {                                           
                        this.isNewPosition = !this.isNewPosition;
                        this.isPositionDisabled = false;
                    }.bind(this), 1000);      

                } else {

                    if ( this.isCurrentTracking === true ) {
                        this.isPositionDisabled = true;
                    } else {
                        this.isPositionDisabled = false;
                    }
                }

            });

            this.emitter.on( 'restart-tracking', () => {    
                clearTimeout( this.startTrackingInterval );
                this.isCurrentTracking = !this.isCurrentTracking;   
                console.log( 'Tracking stopped due to new settings' );
                this.onTrackPosition.call( this, true );
            });

            this.emitter.on( 'end-reload', () => {    
                clearTimeout( this.startTrackingInterval ); 
                this.onTrackPosition.call( this, false );
            });

            this.emitter.on( 'close-settings', () => {    
                this.isSettingsOpen = !this.isSettingsOpen; 
            });
        }
    }
</script>

<template>
    <div class='app__main-container--header' id='header'>
        <div class='app__main-container--header-firstrow'>
            <div class='app__main-container--header-title'>
                <div class='app__main-container--header-logo'>
                    <svg class='svgSpriteBox'><use xlink:href='#appLogo'></use></svg>
                </div>            
                <h2 class='app__main-container--header-title'>OpenStreetMap-Tracker</h2>
            </div>            

            <button class='btn btn--icon btn--icon-notext btn--settings' @click='onOpenSettingsDialog'>
                <svg class='svgSpriteBox' v-bind:class='{ turnSettingsIcon: isSettingsOpen }'><use xlink:href='#settings'></use></svg>
            </button>
        </div>
        
        <div class='app__main-container--header-buttons'> 
            <button class='btn btn--icon' v-bind:class='{ active: isNewPosition }' @click='onGetClientsPosition' :disabled='isPositionDisabled'>
                <svg class='svgSpriteBox'><use xlink:href='#trackPersonIcon'></use></svg>
                Standort
            </button>
            <button class='btn btn--icon' v-bind:class='{ btnHide: isCurrentTracking }' @click='onTrackPosition(true)'>
                <svg class='svgSpriteBox'><use xlink:href='#doubleMarkers'></use></svg>
                Starten
            </button>
            <button class='btn btn--icon active btnHide' v-bind:class='{ btnShow: isCurrentTracking }' @click='onStopTracking()'>
                <svg class='svgSpriteBox'><use xlink:href='#doubleMarkers'></use></svg>
                Beenden
            </button>
        </div>        
    </div>
</template>