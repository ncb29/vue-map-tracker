<script>
    import { clientGeoLocation }  from '@/data/GeoLocation.js'

    export default {
        el: '#header',
        name: 'Header',
        data: () => ({ 
            isNewPosition: false,
            isCurrentTracking: false,
            isSettingsOpen: false,
            isPositionDisabled: false,
            isStopTracking: false,
            isPreciseMode: false
        }),
        methods: {

            clientGeoLocation,            

            onOpenSettingsDialog() { 

                if ( this.isCurrentTracking === false && this.isSettingsOpen === true) {
                    this.isPositionDisabled = false;
                } else {
                    this.isPositionDisabled = true;       
                }

                this.isSettingsOpen = !this.isSettingsOpen;                      
                    
                // We need the isCurrentTracking boolean to check if tracking is active when define new interval interval value.            
                this.emitter.emit( 'open-settings', this.isCurrentTracking );
            },

            getTrackingModeAndTolerance() {
                const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
                this.isPreciseMode = storedSettings.preciseMode;
                this.nPreciseTolerance = storedSettings.preciseToleranceValue;
                document.getElementById( 'headerAccuracy' ).innerHTML = storedSettings.preciseToleranceText
            },

            onGetClientsPosition() {         
                this.isNewPosition = !this.isNewPosition; 
                this.isPositionDisabled = true; 
                this.emitter.emit( 'start-reload' );               
                clientGeoLocation.call( this, 'single' );               
            },

            onTrackPosition( bTrackDirectly, bInitialTracking ) {

                let nInterval;
                const storedInterval = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                this.isPositionDisabled = true;

                if ( storedInterval !== null && storedInterval.intervalValue !== '' ) {

                    nInterval = storedInterval.intervalValue;
                    console.log( 'Current selected interval', nInterval );  

                } else {

                    // Fallback intervall.
                    nInterval = 20000;
                }  

                // First call client geo data directly...
                if ( bTrackDirectly !== false ) {
                    this.isCurrentTracking = !this.isCurrentTracking;

                    if ( bInitialTracking === true) {
                        clientGeoLocation.call( this, 'multiple-initial' );
                    } else {
                        clientGeoLocation.call( this, 'multiple' );
                    }
                    
                    this.emitter.emit( 'start-reload' );
                }                    

                // ... then call data by interval
                this.startTrackingInterval = setTimeout(

                    function() { 
                        console.log( 'Current interval seconds inside interval', nInterval )                                        
                        clientGeoLocation.call( this, 'multiple' );
                        this.emitter.emit( 'start-reload' );
                    }.bind(this),

                nInterval);  

            },

            onStopTracking () {                
                const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );
                let oLastPositionObject = window.oCurrentPositionObject;

                this.emitter.emit( 'start-reload' );
                this.isCurrentTracking = !this.isCurrentTracking;
                clearTimeout( this.startTrackingInterval );
                
                if ( storedSettings.preciseMode === true ) {
                    clientGeoLocation.call( this, 'stop' );
                }                

                if ( oLastPositionObject !== undefined ) {
                    console.log( 'Last position after stop tracking (window.variable)', oLastPositionObject );

                    oLastPositionObject.trackingStatus = 'stopped';
                    oLastPositionObject.message = {
                        'title': 'Tracking beendet',
                        'text': '',
                        'stateNewMarker': false,
                    };       

                    this.emitter.emit( 'update-components', oLastPositionObject );  
                }                
            }
        },      
        created() {
            
        },  
        mounted() {
                        
            clientGeoLocation.call( this , 'initial' );

            this.getTrackingModeAndTolerance();

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

                if ( this.isCurrentTracking === false ) {
                    this.isPositionDisabled = false;
                }     
                
                this.getTrackingModeAndTolerance();
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
        
        <div class='app__main-container--header-secondrow'> 
            <div class='app__main-container--header-accuracy' v-bind:class='{ showHeaderAccuracy: isPreciseMode }'>
                <!-- <svg class="svgSpriteBox"><use xlink:href="#mapArrow"></use></svg> -->
                <span id='headerAccuracy'></span>
            </div>
            <div class='app__main-container--header-buttons'>
                <button class='btn btn--icon' v-bind:class='{ active: isNewPosition }' @click='onGetClientsPosition' :disabled='isPositionDisabled'>
                    <svg class='svgSpriteBox'><use xlink:href='#trackPersonIcon'></use></svg>
                    Standort
                </button>
                <button class='btn btn--icon' v-bind:class='{ btnHide: isCurrentTracking }' @click='onTrackPosition(true, true)' :disabled='isSettingsOpen'>
                    <svg class='svgSpriteBox'><use xlink:href='#doubleMarkers'></use></svg>
                    Starten
                </button>
                <button class='btn btn--icon active btnHide' v-bind:class='{ btnShow: isCurrentTracking }' @click='onStopTracking()' :disabled='isSettingsOpen'>
                    <svg class='svgSpriteBox'><use xlink:href='#doubleMarkers'></use></svg>
                    Beenden
                </button>
            </div>            
        </div>        
    </div>
</template>