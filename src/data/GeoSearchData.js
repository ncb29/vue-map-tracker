export async function getGeoSearchData ( searchValue ) {  

    const reverseGeocodeService = 'https://nominatim.openstreetmap.org/search';

    return fetch( `${reverseGeocodeService}?format=jsonv2&q=${searchValue}` )
    .then( response => response.json() )              
    .then( data => { 

        console.log("Search data", data)
    } );
}