export async function getGeoPositionInfo ( oLocation ) {  

    const reverseGeocodeService = 'https://nominatim.openstreetmap.org/reverse';

    return fetch( `${reverseGeocodeService}?format=jsonv2&lat=${oLocation.lat}&lon=${oLocation.lng}` )
    .then( response => response.json() )              
    .then( positionData => { 

        console.log( 'Marker Geo positionData', positionData );
           
        return positionData; 

    } );
}