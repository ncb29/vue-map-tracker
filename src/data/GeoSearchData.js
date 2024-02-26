export async function getGeoSearchData ( searchValue ) {  

    const reverseGeocodeService = 'https://nominatim.openstreetmap.org/search';

    return fetch( `${reverseGeocodeService}?q=${searchValue}&polygon_geojson=1&format=jsonv2` )
    .then( response => response.json() )              
    .then( searchData => { 

        return searchData;
    } );
}