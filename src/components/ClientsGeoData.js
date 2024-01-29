export const clientGeoData = () => {

    const successCallback = (position) => {
        const { latitude, longitude } = position.coords;
        let accuracy = position.coords.accuracy;
        let fixedAccuracy = accuracy.toFixed(2);
        console.log("LNG, LAT, Accuracy", latitude, longitude, fixedAccuracy)
        console.log("Position Object",  position.coords)

        var oClientPosition = {
            "latitude": latitude,
            "longitude": longitude,
            "accuracy": fixedAccuracy
        }
        
        window.localStorage.setItem("ClientsCurrentPosition", JSON.stringify(oClientPosition))
        return;
    };

    const errorCallback = (error) => {
        if (error.code == 1) {
            window.localStorage.setItem("ClientsCurrentPosition", "No Permission")
        }
        return;
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
        {
            enableHighAccuracy: true,
            maximumAge: 0
        }
    );  
    
    return;
    
};