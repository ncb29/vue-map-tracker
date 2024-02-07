export function clientGeoData ( sTrackingType ) {   

    if (navigator.geolocation) {

        const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
        const preciseMode = storedSettings.preciseMode;

        if (preciseMode === true) {

            if ( sTrackingType !== 'stop' ) {

                this.geoId = navigator.geolocation.watchPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      const timestamp = position.timestamp;
                      let accuracy = position.coords.accuracy;
                      let fixedAccuracy = accuracy.toFixed( 2 );
                      const oFormerPosition = window.oCurrentPositionObject         
          
                      console.log( 'Former object (window.variable)', oFormerPosition );
                      console.log( 'LAT =', latitude, 'LNG =', longitude, 'ACCURACY =', fixedAccuracy )
          
                      if ( position.coords.accuracy > 10 ) {
          
                          console.log("The GPS accuracy isn't good enough");
                          document.getElementById( 'accuracyBox' ).innerHTML = fixedAccuracy;
          
                      } else {
          
                          window.navigator.geolocation.clearWatch(this.geoId);
          
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
          
                    },
                    (error) => {
                          console.log("Error", error)
                    },
          
                    { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
                );
          
                return () => {
                    console.log('Clear watch called');
                    window.navigator.geolocation.clearWatch(this.geoId);
                };

            } else {

                console.log('Clear watch called');
                window.navigator.geolocation.clearWatch(this.geoId);
            }            

        } else {

            const successCallback = ( position ) => {
                const { latitude, longitude } = position.coords;
                const timestamp = position.timestamp;
                let accuracy = position.coords.accuracy;
                let fixedAccuracy = accuracy.toFixed( 2 );
                const oFormerPosition = window.oCurrentPositionObject         

                console.log( 'Former object (window.variable)', oFormerPosition );
                console.log( 'LAT =', latitude, 'LNG =', longitude, 'ACCURACY =', fixedAccuracy )

                // Check if accuracy is not to low. When throw message and set default marker. Else continue.
                if ( Number( fixedAccuracy ) >= 80.00 ) {

                    let oClientPosition = {
                        'latitude': 53.5560767,
                        'longitude': 9.9284123,
                        'accuracy': '>= 80.00',
                        'timestamp': timestamp,
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
                    let oClientPosition = {
                        'latitude': oFormerPosition.latitude,
                        'longitude': oFormerPosition.longitude,
                        'accuracy': oFormerPosition.accuracy,
                        'timestamp': timestamp,
                        'message': {
                            'title': 'Selbe Position',
                            'text': 'Du befindest dich an derselben Position wie zuvor. Es wurde kein neuer Marker gesetzt.',
                            'confirm': false
                        }, 
                        'stateNewMarker': false,
                        'trackingStatus': 'active',
                        'trackingType': sTrackingType                               
                    }

                    this.emitter.emit( 'update-components', oClientPosition );

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