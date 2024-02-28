export async function getGeoRoutingData ( startPoint, endPoint ) {  

    console.log("Routing Submit Data", startPoint, endPoint)

    const osmRoutingService = 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/';
    // `${osmRoutingService}9.95258165041237,53.580262;9.932794889943033,53.55758685?overview=false&alternatives=true&steps=true`

    return fetch( `${osmRoutingService}${startPoint};${endPoint}?overview=false&alternatives=true&steps=true` )
    .then( response => response.json() )              
    .then( routingData => { 

        return routingData;
    } );
}