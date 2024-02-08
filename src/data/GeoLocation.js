export function clientGeoLocation ( sTrackingType ) {   

    if ( navigator.geolocation ) {

        const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
        const preciseMode = storedSettings.preciseMode;
        var oFormerPosition = window.oCurrentPositionObject;    
        
        // Default same position object
        if ( (oFormerPosition !== undefined && sTrackingType !== 'multiple-initial') && sTrackingType !== 'stop' ) {

            var oSamePosition = {
                'latitude': oFormerPosition.latitude,
                'longitude': oFormerPosition.longitude,
                'accuracy': oFormerPosition.accuracy,
                'timestamp': "",
                'message': {
                    'title': 'Selbe Position',
                    'text': 'Du befindest dich an derselben Position wie zuvor. Es wurde kein neuer Marker gesetzt.',
                    'confirm': false
                }, 
                'stateNewMarker': false,
                'trackingStatus': 'active',
                'trackingType': sTrackingType                               
            }

        } else {
            oFormerPosition = undefined;
        }

        if ( preciseMode === true ) {

            if ( sTrackingType !== 'stop' ) {

                this.geoId = navigator.geolocation.watchPosition(

                    ( position ) => {
                        const { latitude, longitude } = position.coords;
                        const timestamp = position.timestamp;
                        let accuracy = position.coords.accuracy;
                        let fixedAccuracy = accuracy.toFixed( 2 );                     
            
                        console.log( 'Former object (window.variable)', oFormerPosition );
                        console.log( 'LAT =', latitude, 'LNG =', longitude, 'ACCURACY =', fixedAccuracy )
            
                        if ( position.coords.accuracy > 10 ) {
            
                            console.log("The GPS accuracy isn't good enough");
                            document.getElementById( 'accuracyBox' ).innerHTML = fixedAccuracy;
            
                        } else {
          
                            window.navigator.geolocation.clearWatch( this.geoId );

                            // Check if client is at same position as before
                            if ( oFormerPosition !== undefined && ( oFormerPosition.latitude === latitude && oFormerPosition.longitude === longitude ) ) {    
                                
                                oSamePosition.timestamp = timestamp;
                                this.emitter.emit( 'update-components', oSamePosition );        

                            } else {

                                let oClientPosition = {
                                    'latitude': latitude,
                                    'longitude': longitude,
                                    'accuracy': fixedAccuracy,
                                    'timestamp': timestamp,
                                    'message': '',     
                                    'stateNewMarker': true,
                                    'trackingStatus': 'active',
                                    'trackingType': sTrackingType     
                                }
                                
                                console.log( 'Current Position Object', oClientPosition );
                                this.emitter.emit( 'update-components', oClientPosition );
                            }
                        }          
                    },
                    (error) => {
                        const { code } = error;
                        switch ( code ) {
                            case GeolocationPositionError.TIMEOUT:
        
                                // Handle timeout.
                                navigator.geolocation.getCurrentPosition( successCallback, errorCallback, oGeolocationOptions );               
                                break;
        
                            case GeolocationPositionError.PERMISSION_DENIED:
        
                                // User denied the request.
                                let oClientPosition = {
                                    'latitude': 0.00,
                                    'longitude': 0.00,
                                    'accuracy': '00.00',
                                    'timestamp': '',
                                    'message': {
                                        'title': 'Standort inaktiv',
                                        'text': 'Die Ortung wurde nicht gestartet. Standort nicht aktiv.',
                                        'confirm': true
                                    }, 
                                    'stateNewMarker': false,
                                    'trackingStatus': 'active',
                                    'trackingType': sTrackingType                                        
                                }

                                this.emitter.emit( 'update-components', oClientPosition );
                                break;
        
                            case GeolocationPositionError.POSITION_UNAVAILABLE:
        
                                // Position not available.
                                console.log( 'POSITION_UNAVAILABLE' )
                                break;
                        };
                    },
          
                    { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
                );
          
                return () => {
                    console.log('Clear watch called');
                    window.navigator.geolocation.clearWatch( this.geoId );
                };

            } else {

                console.log('Clear watch called');
                window.navigator.geolocation.clearWatch( this.geoId );
            }            

        } else {

            // To get sure when precision mode changed, stop watching.
            if ( this.geoId !== undefined ) {
                window.navigator.geolocation.clearWatch( this.geoId );
            }

            const successCallback = ( position ) => {
                const { latitude, longitude } = position.coords;
                const timestamp = position.timestamp;
                let accuracy = position.coords.accuracy;
                let fixedAccuracy = accuracy.toFixed( 2 );

                console.log( 'Former object (window.variable)', oFormerPosition );
                console.log( 'LAT =', latitude, 'LNG =', longitude, 'ACCURACY =', fixedAccuracy )

                // Check if accuracy is not to low. When throw message and set default marker. Else continue.
                if ( Number( fixedAccuracy ) >= 80.00 ) {

                    let oClientPosition = {
                        'latitude': 53.5560767,
                        'longitude': 9.9284123,
                        'accuracy': '>= 80.00',
                        'timestamp': "",
                        'message': {
                            'title': 'Ungenaue Ortung',
                            'text': 'Die Ortung war zu ungenau. Es wurde kein Marker gesetzt.',
                            'confirm': false
                        },                    
                        'stateNewMarker': false,
                        'trackingStatus': 'active',
                        'trackingType': sTrackingType                               
                    }

                    this.emitter.emit( 'update-components', oClientPosition );

                } else if ( oFormerPosition !== undefined && ( oFormerPosition.latitude === latitude && oFormerPosition.longitude === longitude ) ) {
                    // Check if client is at same position as before                    

                    /*
                    ** FOR TESTING PURPOSES
                    */
                    // oSamePosition.stateNewMarker = true;
                    // var max = 9;
                    // var min = 1;
                    // var randomnum = Math.floor(Math.random() * (max - min + 1) + min);
                    // oSamePosition.latitude = oSamePosition.latitude * Number(""+Math.floor(Math.random() * (max - min + 1) + min) +"."+Math.floor(Math.random() * (max - min + 1) + min) + Math.floor(Math.random() * (max - min + 1) + min)+"");
                    // oSamePosition.longitude = oSamePosition.longitude * Number(""+Math.floor(Math.random() * (max - min + 1) + min) +"."+Math.floor(Math.random() * (max - min + 1) + min) + Math.floor(Math.random() * (max - min + 1) + min)+"");

                    oSamePosition.timestamp = timestamp;
                    this.emitter.emit( 'update-components', oSamePosition );        

                } else {

                    let oClientPosition = {
                        'latitude': latitude,
                        'longitude': longitude,
                        'accuracy': fixedAccuracy,
                        'timestamp': timestamp,
                        'message': '',     
                        'stateNewMarker': true,
                        'trackingStatus': 'active',
                        'trackingType': sTrackingType     
                    }
                    
                    console.log( 'Current Position Object', oClientPosition );
                    this.emitter.emit( 'update-components', oClientPosition );
                }               
            };

            const errorCallback = ( error ) => {
            
                const { code } = error;
                switch ( code ) {
                    case GeolocationPositionError.TIMEOUT:

                        // Handle timeout.
                        navigator.geolocation.getCurrentPosition( successCallback, errorCallback, oGeolocationOptions );               
                        break;

                    case GeolocationPositionError.PERMISSION_DENIED:

                        // User denied the request.
                        let oClientPosition = {
                            'latitude': 0.00,
                            'longitude': 0.00,
                            'accuracy': '00.00',
                            'timestamp': '',
                            'message': {
                                'title': 'Standort inaktiv',
                                'text': 'Die Ortung wurde nicht gestartet. Standort nicht aktiv.',
                                'confirm': true
                            }, 
                            'stateNewMarker': false,
                            'trackingStatus': 'active',
                            'trackingType': sTrackingType                                        
                        }
                        this.emitter.emit( 'update-components', oClientPosition );
                        break;

                    case GeolocationPositionError.POSITION_UNAVAILABLE:

                        // Position not available.
                        console.log( 'POSITION_UNAVAILABLE' )
                        break;
                };
            };    

            let oGeolocationOptions = {
                enableHighAccuracy: true,
                timeout: 500,
                maximumAge: 500,
            };         

            navigator.geolocation.getCurrentPosition( successCallback, errorCallback, oGeolocationOptions ); 
        }
    }
    
    return;           
};