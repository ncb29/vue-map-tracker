export function clientGeoData () {   
    
    const successCallback = (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = position.timestamp;
        let accuracy = position.coords.accuracy;
        let fixedAccuracy = accuracy.toFixed(2);        

        let oClientPosition = {
            "latitude": latitude,
            "longitude": longitude,
            "accuracy": fixedAccuracy,
            "timestamp": timestamp,
            "message": "",     
            "stateNewMarker": true     
        }

        console.log("LAT =", latitude, "LNG =", longitude, "ACCURACY =", fixedAccuracy)

        // Check if accuracy is not to low. When throw message and set default marker. Else continue.
        if (Number(fixedAccuracy) >= 80.00) {

            oClientPosition = {
                "latitude": 53.5560767,
                "longitude": 9.9284123,
                "accuracy": ">= 80.00",
                "timestamp": timestamp,
                "message": "Die Ortung war zu ungenau. Es wurde kein neuer Marker gesetzt.",     
                "stateNewMarker": false                               
            }

            this.emitter.emit("update-components", oClientPosition);

        } else {
            
            console.log("Current Position Object", oClientPosition);
            this.emitter.emit("update-components", oClientPosition);
        }               
    };

    const errorCallback = (error) => {
       
        const { code } = error;
        switch (code) {
            case GeolocationPositionError.TIMEOUT:

                // Handle timeout.
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback, oGeolocationOptions);               
                break;

            case GeolocationPositionError.PERMISSION_DENIED:

                // User denied the request.
                let oClientPosition = {
                    "latitude": 0.00,
                    "longitude": 0.00,
                    "accuracy": "00.00",
                    "timestamp": "",
                    "message": "Die Ortung wurde nicht gestartet. Standort nicht aktiv.",     
                    "stateNewMarker": false                                         
                }
                this.emitter.emit("update-components", oClientPosition);
                break;

            case GeolocationPositionError.POSITION_UNAVAILABLE:

                // Position not available.
                console.log("POSITION_UNAVAILABLE")
                break;
        };
    };    

    var oGeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 500,
        maximumAge: 500,
    };         

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, oGeolocationOptions);        
        
};