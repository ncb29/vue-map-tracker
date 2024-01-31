export const clientGeoData = async () => {   

    const currentUrl = window.location.href;

    await fetch(currentUrl, {
        method: 'Get',
        data: {}
        }).then(response => {

        if (response.status === 200) {

            const successCallback = (position) => {
                const { latitude, longitude } = position.coords;
                let accuracy = position.coords.accuracy;
                let fixedAccuracy = accuracy.toFixed(2);
                let oCurrentStoredPosition = window.localStorage.getItem("ClientsCurrentPosition");
        
                console.log("LNG, LAT, Accuracy", latitude, longitude, fixedAccuracy)
                console.log("Position Object",  position.coords);
                console.log("Local Storage", oCurrentStoredPosition);
        
                if (oCurrentStoredPosition !== null ) {
                    const aFormerPositions = [];
                    let oCurrentStoredPosition = JSON.parse(window.localStorage.getItem("ClientsCurrentPosition"));
        
                    if (oCurrentStoredPosition.latitude !== latitude || oCurrentStoredPosition.longitude !== longitude ) {
                        aFormerPositions.push(oCurrentStoredPosition);
                        window.localStorage.setItem("ClientsStoredPositions", JSON.stringify(aFormerPositions))
                    }            
                }
        
                var oClientPosition = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "accuracy": fixedAccuracy
                }
                
                window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oClientPosition))
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
                      window.localStorage.setItem("ClientsCurrentPosition", "No Permission");
                      break;
                    case GeolocationPositionError.POSITION_UNAVAILABLE:
                      // Position not available.
                      break;
                };
            };

            const oGeolocationOptions = {
                enableHighAccuracy: true,
                timeout: 0,
                maximumAge: 500,
            };    
            
            //  return navigator.geolocation.watchPosition(successCallback, errorCallback, oGeolocationOptions);  
            return navigator.geolocation.getCurrentPosition(successCallback, errorCallback, oGeolocationOptions);                 
        }
        
        }).catch(error => {
            console.error("Error", error);
        }
    );
};