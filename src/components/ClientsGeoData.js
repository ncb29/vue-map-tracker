export function clientGeoData (trackingType) {   
    
    const successCallback = (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = position.timestamp;
        let accuracy = position.coords.accuracy;
        let fixedAccuracy = accuracy.toFixed(2);        
        const oCurrentStoredPosition = window.localStorage.getItem("ClientsCurrentPosition");

        let oClientPosition = {
            "latitude": latitude,
            "longitude": longitude,
            "accuracy": fixedAccuracy,
            "timestamp": timestamp,
            "error": ""          
        }

        console.log("LAT =", latitude, "LNG =", longitude, "ACCURACY =", fixedAccuracy)
        // console.log("Position Object",  position.coords);
        console.log("Old Storage", oCurrentStoredPosition);

        // Check if accuracy is not to low. Else throw message and set default marker.
        if (Number(fixedAccuracy) >= 80.00) {

            oClientPosition = {
                "latitude": 53.5560767,
                "longitude": 9.9284123,
                "accuracy": "> 80.00",
                "timestamp": timestamp,
                "error": "Die Ortung war zu ungenau. Es wurde kein neuer Marker gesetzt"          
            }

            window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oClientPosition));
            this.emitter.emit("update-components");

        } else {

            if (oCurrentStoredPosition !== null ) {
                const aFormerPositions = [];
    
                if (oCurrentStoredPosition.latitude !== latitude || oCurrentStoredPosition.longitude !== longitude ) {
                    aFormerPositions.push(oCurrentStoredPosition);
                    window.localStorage.setItem("ClientsStoredPositions", JSON.stringify(aFormerPositions))
                }   
            } else {
                window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oClientPosition));
                this.emitter.emit("update-components");
            }
            
            window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oClientPosition));
            console.log("Current LocalStorage Item Set", window.localStorage.getItem("ClientsCurrentPosition"));
            this.emitter.emit("update-components");
        }       

        // update map and footer component
        
    };

    const errorCallback = (error) => {
       
        const { code } = error;
        switch (code) {
            case GeolocationPositionError.TIMEOUT:
                // Handle timeout.
                if (trackingType === "getPosition") {
                    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, oGeolocationOptions);
                } else {
                    navigator.geolocation.watchPosition(successCallback, errorCallback, oGeolocationOptions);
                }
                break;
            case GeolocationPositionError.PERMISSION_DENIED:
                // User denied the request.
                window.localStorage.setItem("ClientsCurrentPosition", "No Permission");
                break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
                // Position not available.
                break;
        };
    };
    
    if (trackingType === "getPosition" || trackingType === undefined) {

        var oGeolocationOptions = {
            enableHighAccuracy: true,
            timeout: 500,
            maximumAge: 500,
        };            
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, oGeolocationOptions);

    } else {

        var oGeolocationOptions = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 30000,
        };            
        navigator.geolocation.watchPosition(successCallback, errorCallback, oGeolocationOptions);
    }
        
};