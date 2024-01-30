export const clientGeoData = () => {

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
        return;
    };

    const errorCallback = (error) => {
        switch(error.code) {
            case error.TIMEOUT:
              // Acquire a new position object.
              navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
              break;
            case error.code == 1:
              window.localStorage.setItem("ClientsCurrentPosition", "No Permission")
          };
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
        {
            enableHighAccuracy: true,
            maximumAge: 600000, 
            timeout:0
        }
    );  
    
    return;
    
};