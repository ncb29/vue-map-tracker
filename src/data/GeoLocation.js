export function clientGeoLocation ( sTrackingType ) {       

    if ( navigator.geolocation ) {

        const that = this;
        const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
        const preciseMode = storedSettings.preciseMode;
        var oFormerPosition = window.oCurrentPositionObject;

        if ( sTrackingType === 'stop' ) {

            if ( this.geoTrackingId !== undefined ) {
                window.navigator.geolocation.clearWatch( this.geoTrackingId );
            }

            return;

        } else {   
            
            if ( ( oFormerPosition !== undefined && sTrackingType === 'multiple-initial' ) ) {
                oFormerPosition = undefined;
            }                
            
            /**
             * Default new location class. Use it for new location objects dependent on parameters.
             */
            class newLocation {  

                constructor ( latitude, longitude, accuracy, timestamp, messageKey, stateNewMarker ) { 
                    this.latitude = latitude; 
                    this.longitude = longitude;
                    this.accuracy = accuracy;
                    this.timestamp = timestamp;
                    this.message = this.processMessage( messageKey );
                    this.stateNewMarker = stateNewMarker;
                    this.trackingStatus = 'active';
                    this.trackingType = sTrackingType;
                    this.sendNewLocation( this );
                };   

                processMessage( messageKey ) {
                    // Message Keys:
                    // Same position = SP
                    // Inaccurate positioning = IP
                    // Location tracker disabled = LD
                    let oMessageObject;

                    if ( messageKey === 'SP' ) {

                        oMessageObject = {
                            'title': 'Selbe Position',
                            'text': 'Du befindest dich an derselben Position wie zuvor. Es wurde kein neuer Marker gesetzt.'
                        }

                    } else if ( messageKey === 'IP' ) {

                        oMessageObject = {
                            'title': 'Ungenaue Ortung',
                            'text': 'Die Ortung war zu ungenau. Es wurde kein Marker gesetzt.',
                        }

                    } else if ( messageKey === 'LD' ) {

                        oMessageObject = {
                            'title': 'Standort inaktiv',
                            'text': 'Die Ortung wurde nicht gestartet. Standort nicht aktiv.',
                        }

                    } else {
                        oMessageObject = {}
                    }
                    
                    return oMessageObject;
                };
                
                sendNewLocation() {
                    console.log("New Location Object from Constructor", this );
                    that.emitter.emit( 'update-components', this ); 
                };
            }


            /**
             * A function to process success from normal and precise mode
             * @param {*} position 
             */
            function processSuccess ( position ) {
                const { latitude, longitude } = position.coords;
                const timestamp = position.timestamp;
                let fixedAccuracy = position.coords.accuracy.toFixed( 2 );

                console.log( 'Former object (window.variable)', oFormerPosition );
                console.log( 'LAT =', latitude, 'LNG =', longitude, 'ACCURACY =', fixedAccuracy )

                // Check if accuracy is not to low. When throw message and set default marker. Else continue.
                if ( Number( fixedAccuracy ) >= 80.00 ) {

                    let stateNewMarker = false;
                    let messageKey = 'IP';
                    new newLocation( latitude, longitude, fixedAccuracy, timestamp, messageKey, stateNewMarker );   

                } else if ( oFormerPosition !== undefined && ( oFormerPosition.latitude === latitude && oFormerPosition.longitude === longitude ) ) {
                    // Check if client is at same position as before 
                    
                    let messageKey = 'SP';
                    let stateNewMarker = false;
                    new newLocation( latitude, longitude, fixedAccuracy, timestamp, messageKey, stateNewMarker );

                        /*
                    ** FOR TESTING PURPOSES
                    */                    
                    // var max = 9;
                    // var min = 1;
                    // var randomnum = Math.floor(Math.random() * (max - min + 1) + min);
                    // newLocationObject.latitude = newLocationObject.latitude * Number(""+Math.floor(Math.random() * (max - min + 1) + min) +"."+Math.floor(Math.random() * (max - min + 1) + min) + Math.floor(Math.random() * (max - min + 1) + min)+"");
                    // newLocationObject.longitude = newLocationObject.longitude * Number(""+Math.floor(Math.random() * (max - min + 1) + min) +"."+Math.floor(Math.random() * (max - min + 1) + min) + Math.floor(Math.random() * (max - min + 1) + min)+"");

                } else {

                    let messageKey = '';
                    let stateNewMarker = true;
                    new newLocation( latitude, longitude, fixedAccuracy, timestamp, messageKey, stateNewMarker );
                }  
            }


            /**
             * A function to process errors from normal and precise mode
             * @param {*} error 
             */
            function processError ( error ) {                

                const { code } = error;
                switch ( code ) {
                    case GeolocationPositionError.TIMEOUT:

                        // Handle timeout.
                        if ( preciseMode === false ) {
                            // It is important to recall getCurrentPosition by Timeout. Otherwise app will not work in non precise mode.
                            navigator.geolocation.getCurrentPosition( successCallback, errorCallback, oGeolocationOptions );  
                        }  

                        break;

                    case GeolocationPositionError.PERMISSION_DENIED:
                        // User denied the request.
                        let latitude = 0.00;
                        let longitude = 0.00;
                        let accuracy = '00.00';
                        let messageKey = 'LD';
                        let stateNewMarker = false;
                        new newLocation( latitude, longitude, accuracy, new Date().valueOf(), messageKey, stateNewMarker );  
                        break;

                    case GeolocationPositionError.POSITION_UNAVAILABLE:

                        // Position not available.
                        latitude = 0.00;
                        longitude = 0.00;
                        accuracy = '00.00';
                        messageKey = 'LD';
                        stateNewMarker = false;
                        new newLocation( latitude, longitude, accuracy, new Date().valueOf(), messageKey, stateNewMarker );  
                        break;
                };
            }         
            
            const successCallback = ( position ) => {
                processSuccess( position );
            }

            const errorCallback = ( error ) => {
                processError( error );
            }

            const oGeolocationOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 500,
            };    
                

            if ( preciseMode === true ) {

                if ( storedSettings.preciseToleranceValue !== undefined && storedSettings.preciseToleranceValue !== '' ) {

                    var toleranceValue = storedSettings.preciseToleranceValue;
                    console.log("Tolerance value is:", toleranceValue);

                } else {
                    var toleranceValue = 10;
                }

                if ( sTrackingType !== 'stop' ) {

                    /**
                     * Start watch geo location position
                     */
                    this.geoTrackingId = navigator.geolocation.watchPosition(

                        // In precise mode the geo location fetch till accuracy is under tolerance value
                        ( position ) => {
                            let fixedAccuracy = position.coords.accuracy.toFixed( 2 );
                
                            // Tolerance value is from settings
                            if ( position.coords.accuracy > toleranceValue ) {
                
                                console.log("The GPS accuracy isn't good enough");
                                // document.getElementById( 'accuracyBox' ).style.opacity = 1;
                                document.getElementById( 'accuracyBoxValue' ).innerHTML = fixedAccuracy;
                
                            } else {
                
                                window.navigator.geolocation.clearWatch( this.geoTrackingId );  
                                // document.getElementById( 'accuracyBox' ).style.opacity = 0;  
                                processSuccess.call(this, position );    
                            }          
                        },
                        ( error ) => {
                            processError.call(this, error ); 
                        },
                
                        { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 }
                    );
                
                    return () => {
                        console.log('Clear watch called');
                        window.navigator.geolocation.clearWatch( this.geoTrackingId );
                    };

                }     

            } else {

                // To get sure when precision mode changed, stop watching.
                // if ( this.geoTrackingId !== undefined ) {
                //     window.navigator.geolocation.clearWatch( this.geoTrackingId );
                // }                

                navigator.geolocation.getCurrentPosition( successCallback, errorCallback, oGeolocationOptions ); 

            }
        }    
    }              
};