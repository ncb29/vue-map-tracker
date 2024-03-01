<script>

    export default {

        el: '#header',
        name: 'Header',

        data: () => ({ 
            isNewPosition: false,
            isCurrentTracking: false,
            isSettingsOpen: false,
            isPositionDisabled: false,
            isTrackStartDisabled: false,
            isTrackEndDisabled: false,
            isStopTracking: false,
            isPreciseMode: false,
            isWakeLockActive: false
        }),

        methods: {


            onToggleSettingsDialog () { 
                
                console.log( "Is current tracking when open settings?", this.isCurrentTracking)
                this.isSettingsOpen = !this.isSettingsOpen;
                this.onDisableEnableButtons( '', '', 'open' );                                      
                    
                // We need the isCurrentTracking boolean to check if tracking is active when define new interval interval value.
                this.emitter.emit( 'toggle-settings', this.isSettingsOpen, this.isCurrentTracking );

                if ( this.isSettingsOpen === false ) {
                    this.emitter.emit( 'close-settings');
                }
            },


            getTrackingModeAndTolerance () {

                const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
                this.isPreciseMode = storedSettings.preciseMode;
                this.nPreciseTolerance = storedSettings.preciseToleranceValue;
                document.getElementById( 'headerAccuracy' ).innerHTML = storedSettings.preciseToleranceText;
            },


            onDisableEnableButtons ( sTrackingType, sTrackingStatus, sSettingsOpenClosed ) {

                if ( sTrackingType === 'single' && sTrackingStatus === 'started' ) {
                    this.isNewPosition = true;
                    this.isPositionDisabled = true; 
                    this.isTrackStartDisabled = true;
                }

                if ( sTrackingType === 'single' && sTrackingStatus === 'finished' ) {
                    this.isNewPosition = false;
                    this.isPositionDisabled = false; 
                    this.isTrackStartDisabled = false;
                }

                if ( ( sTrackingType === 'multiple' || sTrackingType === 'multiple-initial' ) && sTrackingStatus === 'started' ) {
                    this.isNewPosition = false;
                    this.isPositionDisabled = true; 
                    this.isTrackStartDisabled = true;
                    this.isTrackEndDisabled = true;
                }

                if ( ( sTrackingType === 'multiple' || sTrackingType === 'multiple-initial' ) && ( sTrackingStatus === 'finished' || sTrackingStatus === 'stopped' ) ) {
                    this.isNewPosition = false;                    
                    this.isTrackStartDisabled = false;
                    this.isTrackEndDisabled = false;

                    if ( this.isCurrentTracking === true && sTrackingStatus !== 'stopped' ) {
                        this.isPositionDisabled = true; 
                    } else {

                        this.isPositionDisabled = false; 
                        this.isCurrentTracking = false;
                    }
                }

                if ( sSettingsOpenClosed === 'open' ) {
                    this.isPositionDisabled = true; 
                    this.isTrackStartDisabled = true;
                    this.isTrackEndDisabled = true;  
                }  
                
                if ( sSettingsOpenClosed === 'close' ) {                    
                    this.isPositionDisabled = false; 
                    this.isTrackStartDisabled = false;
                    this.isTrackEndDisabled = false;
                    
                    if ( this.isCurrentTracking === true ) {
                        this.isPositionDisabled = true;
                    }
                }               
            },


            onGetClientsPosition () {

                this.onDisableEnableButtons( 'single', 'started' );
                this.emitter.emit( 'start-tracking', 'single' );                      
            },


            toggleWakeLock () {

                this.isWakeLockActive = !this.isWakeLockActive;
                console.log("isWakeLockActive", this.isWakeLockActive)
                if ( this.isWakeLockActive === true ) {

                    if ( window.currentWakeLock && !window.currentWakeLock.released ){
                        this.releaseScreen();
                    }
                    else {
                        this.lockScreen();
                    }

                } else {
                    window.currentWakeLock = null;
                }               
            },


            async lockScreen () {
                try {
                    window.currentWakeLock = await navigator.wakeLock.request();
                }
                catch(err){
                    alert(err);
                }
            },

 
            async releaseScreen () {
                window.currentWakeLock.release();
            },


            onTrackPosition ( bTrackDirectly, bInitialTracking ) {                

                let nInterval;
                const storedInterval = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );                

                // Get timeout interval from local storage.
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

                        // Start wake lock
                        this.toggleWakeLock();
                        
                        this.onDisableEnableButtons( 'multiple-initial', 'started' );                                       
                        this.emitter.emit( 'start-tracking', 'multiple-initial' );

                    } else {
                        
                        this.onDisableEnableButtons( 'multiple', 'started' );                                       
                        this.emitter.emit( 'start-tracking', 'multiple' );
                    }
                }                    

                // ... then call data by interval
                this.startTrackingInterval = setTimeout(

                    function() {      

                        console.log( 'Current interval seconds inside interval', nInterval ) 
                        this.onDisableEnableButtons( 'multiple', 'started' );                                       
                        this.emitter.emit( 'start-tracking', 'multiple' );

                    }.bind(this),

                nInterval);  

            },


            onStopTracking () {     

                let oLastPositionObject = window.oCurrentPositionObject;

                this.toggleWakeLock();

                clearTimeout( this.startTrackingInterval );
                this.emitter.emit( 'start-tracking', 'stop' );                           

                if ( oLastPositionObject !== undefined ) {
                    console.log( 'Last position after stop tracking (window.variable)', oLastPositionObject );

                    oLastPositionObject.trackingStatus = 'stopped';
                    oLastPositionObject.message = {
                        'title': 'Tracking beendet',
                        'text': ''
                    }; 
                    oLastPositionObject.stateNewMarker = false;    

                    this.emitter.emit( 'end-tracking', oLastPositionObject );  
                }                 
            }
        },

        created () {
            
        },  

        mounted () {   


            this.getTrackingModeAndTolerance();


            this.emitter.on( 'restart-tracking', () => {  

                clearTimeout( this.startTrackingInterval );                
                // this.onTrackPosition.call( this, true );
                console.log( 'Tracking stopped due to new settings' );

            });


            this.emitter.on( 'end-reload', ( oPositionObject ) => {  
                
                if ( oPositionObject.trackingType === 'single' ) {

                    oPositionObject.trackingStatus = 'finished';
                    this.onDisableEnableButtons( oPositionObject.trackingType, oPositionObject.trackingStatus );
                }

                if ( oPositionObject.trackingType === 'multiple' && oPositionObject.trackingStatus !== 'stopped' ) {

                    oPositionObject.trackingStatus = 'finished';
                    this.onDisableEnableButtons( oPositionObject.trackingType, oPositionObject.trackingStatus );

                    clearTimeout( this.startTrackingInterval ); 
                    this.onTrackPosition.call( this, false );

                } 
                
                if ( oPositionObject.trackingType !== 'single' && oPositionObject.trackingStatus === 'stopped' ) {
                    this.onDisableEnableButtons( oPositionObject.trackingType, oPositionObject.trackingStatus );
                } 
            });


            this.emitter.on( 'close-settings', () => {    

                this.isSettingsOpen = false;
                this.onDisableEnableButtons( '', '', 'close' );                
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
                    <svg class='svgSpriteBox'>
                        <use xlink:href='#appLogo'></use>
                    </svg>
                </div>            
                <h2 class='app__main-container--header-title'>
                    OpenStreetMap-Tracker
                </h2>
            </div>            

            <button class='btn btn--icon btn--icon-notext btn--settings' @click='onToggleSettingsDialog'>
                <svg class='svgSpriteBox settings-button-background'>
                    <use xlink:href='#backgroundSquare'></use>
                </svg>
                <svg class='svgSpriteBox settings-button' v-bind:class='{ turnSettingsIcon: isSettingsOpen }'>
                    <use xlink:href='#settings'></use>
                </svg>
            </button>
        </div>
        
        <div class='app__main-container--header-secondrow'> 
            <div class='app__main-container--header-accuracy' v-bind:class='{ showHeaderAccuracy: isPreciseMode }'>
                <svg class="svgSpriteBox">
                    <use xlink:href="#crosshair"></use>
                </svg>
                <span id='headerAccuracy'></span>
            </div>
            <div class='app__main-container--header-buttons'>
                <button class='btn btn--icon' v-bind:class='{ active: isNewPosition }' @click='onGetClientsPosition' :disabled='isPositionDisabled'>
                    <svg class='svgSpriteBox'>
                        <use xlink:href='#trackPersonIcon'></use>
                    </svg>
                    Standort
                </button>
                <button class='btn btn--icon' v-bind:class='{ btnHide: isCurrentTracking }' @click='onTrackPosition(true, true)' :disabled='isTrackStartDisabled'>
                    <svg class='svgSpriteBox'>
                        <use xlink:href='#doubleMarkers'></use>
                    </svg>
                    Starten
                </button>
                <button class='btn btn--icon active btnHide' v-bind:class='{ btnShow: isCurrentTracking }' @click='onStopTracking()' :disabled='isTrackEndDisabled'>
                    <svg class='svgSpriteBox'>
                        <use xlink:href='#doubleMarkers'></use>
                    </svg>
                    Beenden
                </button>
            </div>            
        </div>          
    </div>
</template>