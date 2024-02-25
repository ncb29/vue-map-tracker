export async function getGeoPositionInfo ( nTimestamp, oLocation ) {  

    // Create date from timestamp for popup content
    if ( nTimestamp !== undefined ) {

        let locationTimestamp = new Date( nTimestamp );
        let sHour = locationTimestamp.getHours().toString();
        let sMinute = locationTimestamp.getMinutes().toString();
        let sFullDate = new Date( nTimestamp ).toLocaleDateString( { weekday: 'long' } );

        if ( sHour === '0' ) {
            sHour = '00';
        }   
        
        if ( sMinute.length === 1 ) {
            sMinute = '0' + sMinute;
        }

        this.popupContent = 'Um: '+ sHour +':'+ sMinute +' Uhr am '+ sFullDate +'<br><br>';
        console.log( 'Location Timestamp for Tooltip', this.popupContent )
    }

    const reverseGeocodeService = 'https://nominatim.openstreetmap.org/reverse';

    return fetch( `${reverseGeocodeService}?format=jsonv2&lat=${oLocation.lat}&lon=${oLocation.lng}` )
    .then( response => response.json() )              
    .then( data => { 

        if ( data.error === undefined ) {

            console.log( 'Marker Geo Data', data );
            this.popupContent += 'Wo: '+data.address.road+' '+data.address.house_number+', <br>'+data.address.city+' - '+data.address.city_district+' <br>('+data.address.postcode+', '+data.address.country+')';

            console.log( 'Popup content', this.popupContent );
            return this.popupContent;

        } else {

            this.popupContent += 'Location data not available';

            console.log( 'Popup content', this.popupContent );
            return this.popupContent;
        }        
    } );
}