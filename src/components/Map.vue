<script>
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import { icon, Marker } from 'leaflet';
    import { MiniMap } from 'leaflet-control-mini-map';
    import 'leaflet-routing-machine';
    import { getGeoPosition } from '@/data/GeoPosition.js';
    import { getGeoPositionInfo } from '@/data/GeoPositionInfo.js';
    import MainMarker from '@/assets/icons/main-marker.svg';
    import SecondMarker from '@/assets/icons/secondary-marker.svg';
    import DestinationMarker from '@/assets/icons/destination-marker.svg';

    export default {

        el: '#mapContainer',
        name: "Map",

        setup: () => {
            return { MainMarker, SecondMarker};
        },

        data: () => ({ 
            map: null,
            latlng: [],
            renderMap: true,
            isReloading: false,
            isWithMessage: false,
            isPreciseMode: false,
        }),

        methods: {

            getGeoPosition,
            getGeoPositionInfo,


            getReloadGif () {

                if ( location.hostname === 'localhost' || location.hostname === '127.0.0.1' ) {
                    return new URL('../assets/gifs/reload-spinner.gif', import.meta.url).href
                } else {
                    return new URL('/map-tracker/assets/reload-spinner.gif', import.meta.url).href
                }    
            },


            getTrackingMode () {
                const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
                this.isPreciseMode = storedSettings.preciseMode;
            },


            onRemoveMarkerLayers () {
                this.map.eachLayer(function( layer ){
                    if ( layer.options.layerType === 'markerLayer' ) {
                        this.map.removeLayer( layer );  
                    }                                  
                }.bind( this ));
            },

            
            onRemoveSearchLayers () {
                // Before setting new routing layers, remove all existing
                // Remove all existing search layers before setting a routing layer.
                this.map.eachLayer(function( layer ){
                    if ( layer.options.layerType === 'searchLayer' ) {
                        this.map.removeLayer( layer );  
                    }                                  
                }.bind( this ));

                // To get sure all routing data is cleared from map, set an empty waypoints array. Otherwise old routes could be shown on map.
                if ( this.routing ) {
                    this.routing.setWaypoints([])
                } 

                // Remove all existing routing containers.
                const routingContainer = document.getElementsByClassName( 'leaflet-routing-container' );

                if ( routingContainer && routingContainer.length > 0 ) {
                    routingContainer[0].remove();
                }       
            },


            setMarkerOnMap ( latlng, oPositionObject ) {
                this.map.flyTo( [ latlng[0], latlng[1] ] , 18);

                let newMarker = new L.Marker( latlng ).addTo( this.map ).bindPopup('', { direction: 'right' } ).on( 'popupopen', 
                function ( popup ) {
                    this.getTrackingMarkerPopUpContent( popup, oPositionObject.timestamp, newMarker )
                }.bind( this ));

                // If tracking type is single add the class for active marker. We do it also in renderMap multiple tracking.
                if ( oPositionObject.trackingType === 'single' ) {
                    let newMarkerIcon = newMarker._icon; 
                    newMarkerIcon.classList.add( 'active-marker' );
                }
            },


            async getTrackingMarkerPopUpContent (popup, nPositionTimestamp, newMarker) {
                const geoData = await this.getGeoPositionInfo.call( this, nPositionTimestamp, popup.sourceTarget._latlng )
                newMarker.setPopupContent( geoData );
            },


            processSearchResultForMap ( oSearchResult ) {
                let searchResultLayer = {};

                // Before setting new routing layers, remove all existing
                this.onRemoveSearchLayers.call( this );

                if ( oSearchResult.length > 0 ) {

                    console.log("Search result", oSearchResult);
                    const searchResultName = oSearchResult[0].display_name;
                    // const test = searchResultName.substring(0, searchResultName.indexOf(","));
                    const destinationMarkerPopUpContent = '<p>'+searchResultName+'</p>';                    

                    // Set a new search layer
                    if ( oSearchResult[0].geojson.type !== 'Point' ) {

                        // The search result is a polygon or a line
                        searchResultLayer = L.geoJson( oSearchResult[0].geojson,
                            {
                                style: function () {
                                    return { interactive: false, color: '#d40e0c' };
                                },
                                layerType: 'searchLayer'
                            }
                        );

                        // To see a polygon or a line better on map, we set a custom destination marker in the center of it.
                        const newDestinationAreaMarker = new L.Marker( [oSearchResult[0].lat, oSearchResult[0].lon] ).addTo( this.map ).bindPopup('', { direction: 'right' } );                        
                        newDestinationAreaMarker.setPopupContent( destinationMarkerPopUpContent );

                        newDestinationAreaMarker._icon.setAttribute( 'src', DestinationMarker );
                        newDestinationAreaMarker._icon.classList.add( 'destination-marker' );
                        newDestinationAreaMarker.options.layerType = 'searchLayer';

                    } else {

                        // In this case search result is of type "Point" (a marker).
                        // Adjust search marker. Define a popup
                        searchResultLayer = L.geoJson( oSearchResult[0].geojson ); 
                        searchResultLayer.bindPopup('', { direction: 'right' } ); 
                        searchResultLayer.setPopupContent( destinationMarkerPopUpContent );

                        const newSearchMarker = searchResultLayer._layers[ Object.keys( searchResultLayer._layers )[ Object.keys( searchResultLayer._layers ).length - 1 ] ];
                        const newSearchMarkerIcon = newSearchMarker.options.icon.options;
                        newSearchMarker.options.layerType = 'searchLayer';
                        newSearchMarkerIcon.iconUrl = DestinationMarker;
                        newSearchMarkerIcon.className = 'destination-marker'; 
                    }     

                    // Set search result on map.
                    this.map.addLayer( searchResultLayer );
                    this.map.fitBounds( searchResultLayer.getBounds() );
                    this.map.flyTo( [ oSearchResult[0].lat, oSearchResult[0].lon ]);

                    searchResultLayer.options.layerType = 'searchLayer';

                    console.log("Layers in Search after process", this.map._layers)

                    setTimeout(function () {                           
                        this.isReloading = false;                        
                    }.bind( this ), 1000); 

                } else {

                    // No search result. Show it in message box. 

                    this.isWithMessage = true;
                    //Set text in message box title
                    this.$refs.messageBoxTitle.innerHTML = 'Keine Lokation gefunden';  
                    //Set text in message box paragraph
                    this.$refs.messageBoxText.innerHTML = 'Unter diesem Suchbegriff wurde leider kein Ergebnis gefunden. Versuche es mit einem anderen Begriff.';  

                    setTimeout(function () {       
                        this.isWithMessage = false;                    
                        this.isReloading = false;                        
                    }.bind( this ), 3500); 
                } 
            },


            processRouteForMap ( oRoutingData ) {

                // Before setting new routing layers, remove all existing                
                this.onRemoveSearchLayers.call( this );

                // Add new routing
                this.routing = new L.Routing.control({
                        "type": "LineString",                        
                                               
                        waypoints: [
                            L.latLng(oRoutingData.waypoints[0].location[1], oRoutingData.waypoints[0].location[0]),
                            L.latLng(oRoutingData.waypoints[1].location[1], oRoutingData.waypoints[1].location[0]),
                        ],
                        
                        createMarker: (i, waypoints) => {
                            const iconUrl = DestinationMarker;                            
                            const routingIcon = icon({
                                iconUrl,
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],                    
                                popupAnchor: [1, -34],
                                tooltipAnchor: [16, -28],
                                shadowSize: [41, 41],
                            });

                            return new L.Marker(waypoints.latLng, {
                                icon: routingIcon,
                                layerType: 'searchLayer'
                            });
                        },
                        lineOptions : {
                            styles: [
                                {color: 'black', opacity: 0.15, weight: 9, layerType: 'searchLayer'}, 
                                {color: 'white', opacity: 1, weight: 8, layerType: 'searchLayer'}, 
                                {color: '#1484C9', opacity: 1, weight: 4, layerType: 'searchLayer'}
                            ],
                            missingRouteStyles: [
                                {color: 'black', opacity: 0.5, weight: 7, layerType: 'searchLayer'},
                                {color: 'white', opacity: 0.6, weight: 4, layerType: 'searchLayer'},
                                {color: 'gray', opacity: 0.8, weight: 2, dashArray: '7,12', layerType: 'searchLayer'}
                            ],
                            layerType: 'searchLayer'
                        },

                        show: true,
                        addWaypoints: true,
                        autoRoute: true,
                        routeWhileDragging: false,
                        draggableWaypoints: false,
                        useZoomParameter: false,
                        showAlternatives: true,                        
                        layerType: 'searchLayer', // Layer type is always necessary for deleting

                }).addTo( this.map );

                const routingContainer = document.getElementsByClassName( 'leaflet-routing-container' );

                if ( routingContainer && routingContainer.length > 0 ) {
                    routingContainer[0].classList.add( 'leaflet-routing-container-hide' );
                } 
                
                setTimeout(function () {       
                    this.isWithMessage = false;                    
                    this.isReloading = false;                        
                }.bind( this ), 500); 

                console.log("all Layers after adding a route", this.map._layers);
            }
            
        },

        created() {

            this.emitter.on( 'start-tracking', ( sTrackingType ) => {    
                this.isReloading = true;  

                // This is our funnel to GeoLocation.js.
                this.getGeoPosition.call( this, sTrackingType );
            });

        },

        mounted() {     

            // this.emitter.emit( 'initial-track' );
            const oInitialPositionObject = {
                'accuracy': "00.00",
                'latitude': 53.56321,
                'longitude': 10.01678,
                'message': {},
                'stateNewMarker': false,
                'timestamp': 0,
                'trackingStatus': "finished",
                'trackingType': "single",
            }
            renderMap.call( this, oInitialPositionObject ); 


            this.getTrackingMode();


            this.emitter.on( 'close-settings', () => {  
                this.getTrackingMode();             
            });  

            
            this.emitter.on( 'start-reload', () => {  
                this.isReloading = true;             
            });


            this.emitter.on( 'end-reload', () => {  
                this.isReloading = false;             
            });


            this.emitter.on( 'end-tracking', ( oPositionObject ) => {  
                
                // Check if the new position object has a message
                if ( Object.keys( oPositionObject.message ).length !== 0 && oPositionObject.message.constructor === Object ) {
                    //Set text in message box title
                    this.$refs.messageBoxTitle.innerHTML = oPositionObject.message.title;  
                    //Set text in message box paragraph
                    this.$refs.messageBoxText.innerHTML = oPositionObject.message.text;  

                    this.isWithMessage = true; 
                }

                this.getTrackingMode();
                renderMap.call( this, oPositionObject );                 
            });


            this.emitter.on( 'add-custom-map-class', () => {                      
                this.map.boxZoom._container.classList.add( 'adjust-map-control' );
            });


            this.emitter.on( 'remove-custom-map-class', () => {                      
                this.map.boxZoom._container.classList.remove( 'adjust-map-control' );
            });  

            
            this.emitter.on( 'add-search-polygon', ( oSearchResult ) => {       
                if ( this.map && oSearchResult !== undefined ) {                    
                    this.processSearchResultForMap.call( this, oSearchResult )                   
                }
            });    


            this.emitter.on( 'show-route-on-map', ( oRoutingData ) => {       
                console.log("routingData", oRoutingData);  

                if ( this.map && oRoutingData !== undefined ) {                    
                    this.processRouteForMap.call( this, oRoutingData )                   
                }
            }); 
            

             /**
             * Render map function
             * It's called multiple in tracking circle
             * @param {*} oPositionObject 
             */
            function renderMap ( oPositionObject ) {

                console.log( 'oPositionObject', oPositionObject )                

                // Safe current position object to reuse it in header (vue global variables needs a lot of extra code)
                window.oCurrentPositionObject = oPositionObject;

                // Define marker settings
                const iconUrl = MainMarker;
                const iconDefault = icon({
                    iconUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],                    
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41],
                    className: '',                    
                });
                Marker.prototype.options.layerType = 'markerLayer';
                Marker.prototype.options.icon = iconDefault;

                this.latlng = [];                      

                // Check if the new position object is not null, of type object and is not empty.
                if ( oPositionObject !== null && Object.keys( oPositionObject ).length !== 0  ) {

                    this.latlng = [ ''+oPositionObject.latitude+'', ''+oPositionObject.longitude+'' ];   

                } else {

                    // Set fallback geo data
                    this.latlng = [ '53.56321', '10.01678' ]; 
                }                 

                if ( this.latlng ) {

                    // No map was already rendered. Create new map
                    if ( !this.map ) {

                        // Leaflet js has a problem with popups and tooltips on markers when zooming the map.
                        // Error thrown: TypeError: Cannot read properties of null (reading '_latLngToNewLayerPoint')
                        // This workaround is from: https://salesforce.stackexchange.com/questions/180977/leaflet-error-when-zoom-after-close-popup-in-lightning-component
                        // ToDo: Reach the same solution for tooltips
                        L.Popup.prototype._animateZoom = function ( e ) {

                            if ( !this.map ) {
                                return;
                            }
                            // var pos = this.map._latLngToNewLayerPoint( this.latlng, e.zoom, e.center ),
                            // anchor = this._getAnchor()
                            // L.DomUtil.setPosition( this._container, pos.add( anchor ) );                            
                        }   

                        this.map = L.map( 'mapContainer', {
                            center: this.latlng,
                            zoomControl: true,
                            zoom: 10,
                            zoomAnimation: true,
                            fadeAnimation: true,
                            markerZoomAnimation: true,                            
                        });


                        const tileLayerUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';

                        const tileLayer = new L.TileLayer( tileLayerUrl, {
                            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
                            maxNativeZoom: 18,
                            maxZoom: 18,   
                            layerType: 'initialLayer'                         
                        }).addTo( this.map );


                        // Add minimap to map
                        const miniMapOptions = {
                            toggleDisplay: true,
                            minimized: true,
                            position: 'bottomright',
                            collapsedWidth: 29,
                            collapsedHeight: 29,
                            zoomLevelOffset: -4,
                            layerType: 'initialLayer'
                        }
                        const miniMapTileLayer = new L.TileLayer( tileLayerUrl, { minZoom: 0, maxZoom: 18 });
                        const miniMap = new L.Control.MiniMap( miniMapTileLayer, miniMapOptions ).addTo( this.map );
                        
                        // Custom minimap class added by toggle
                        miniMap.addEventListener("restore", function() { 
                            // console.log("this.map", this.map);
                            // console.log("miniMap", miniMap);

                            miniMap._map.setView( this.map._lastCenter );
                            miniMap._container.classList.add('custom-mini-map-open');
                        }.bind( this ));

                        miniMap.addEventListener("minimize", function(){
                            miniMap._container.classList.remove('custom-mini-map-open');
                        });                   


                        // Set a marker to map (current client position)
                        // oPositionObject.stateNewMarker = true;
                        if ( oPositionObject && oPositionObject.stateNewMarker === true ) {    

                            this.setMarkerOnMap.call( this, this.latlng, oPositionObject );
                            console.log( 'New Map this.latlng', this.latlng );

                        } else {
                            
                            console.log( 'No initial marker' );                            
                        }
                        
                        console.log( 'Layers after creation', this.map._layers );
                        
                    } else {

                        // This is the tracking type of the first round of tracking. Before setting a new marker, we have to remove all existing layers.
                        if ( oPositionObject.trackingType === 'multiple-initial' ) {

                            // If tracking type is multiple-initial, remove the last setted layer. We can achieve it to check for layertype "markerLayer".
                            this.onRemoveMarkerLayers.call( this )                           

                            // Set tracking type to multiple (normal value).
                            if ( oPositionObject.trackingType === 'multiple-initial' ) {
                                oPositionObject.trackingType = 'multiple';
                            }
                        }

                        // Set a new center and marker to map (current client position) if allowed.
                        // oPositionObject.stateNewMarker = true;
                        if ( oPositionObject.stateNewMarker === true ) {                           

                            if ( oPositionObject.trackingType === 'single' ) {

                                // If tracking type is single, remove the last setted layer. We can achieve it to check for layertype "markerLayer".
                                this.onRemoveMarkerLayers.call( this )                               
                                
                                // Create new marker       
                                this.setMarkerOnMap.call( this, this.latlng, oPositionObject )

                            } else {

                                // If tracking type is 'multiple' change the icon from last setted marker to blue one.
                                // let oLastSettedMapLayer = this.map._layers[ Object.keys( this.map._layers )[ Object.keys( this.map._layers ).length - 1 ] ]; // Get the last layer object of all layers
                                
                                // // When in tracking mode and popup is open, the condition is not true (cause of .toGeoJSOn). So old marker does not remove.
                                // // Check for open popup and close it. After that detect last setted layer
                                // if ( oLastSettedMapLayer._source !== undefined ) {
                                //     oLastSettedMapLayer._source.togglePopup();
                                //     oLastSettedMapLayer = this.map._layers[ Object.keys( this.map._layers )[ Object.keys( this.map._layers ).length - 1 ] ];
                                // }
                                                                
                                // if ( ( oLastSettedMapLayer !== undefined && oLastSettedMapLayer !== null ) && !!oLastSettedMapLayer.toGeoJSON ) {
                                //     let oLastSettedMapLayerIcon = oLastSettedMapLayer._icon; // Get the icon from last layer
                                //     oLastSettedMapLayerIcon.setAttribute( 'src', SecondMarker ); // Change the Icon src
                                //     oLastSettedMapLayerIcon.classList.remove( 'active-marker' ); // Remove class active-marker
                                // }     

                                
                                this.map.eachLayer(function( layer ){
                                    
                                    if ( layer.options.layerType === 'markerLayer' ) {

                                        // if ( layer._source !== undefined ) {
                                        //     layer._source.togglePopup(); 
                                        // }
                                        let oLayerIcon = layer._icon;
                                        oLayerIcon.setAttribute( 'src', SecondMarker );
                                        oLayerIcon.classList.remove( 'active-marker' );

                                    }                                  
                                }.bind( this ));


                                // Create new marker
                                this.setMarkerOnMap.call( this, this.latlng, oPositionObject );

                                // Cause we set a new marker, a new layer was created. So we have to ask again for the newest layer.
                                let oLastSettedMapLayer = this.map._layers[ Object.keys( this.map._layers )[ Object.keys( this.map._layers ).length - 1 ] ]; // Get the last layer object of all layers
                                let oLastSettedMapLayerIcon = oLastSettedMapLayer._icon; // Get the icon from last layer
                                oLastSettedMapLayerIcon.classList.add( 'active-marker' ); // Add class active-marker

                            }

                            console.log( 'Existing Layers:', this.map._layers, "Layers Length:", Object.keys( this.map._layers ).length);
                            
                        } else {

                            console.log( 'No new marker' )
                        }
                    }                    
                }        

                console.log("Tracking Status:", oPositionObject.trackingStatus, "Tracking Type:", oPositionObject.trackingType)
                               
                if ( this.isWithMessage === true ) {

                    setTimeout(function () {                           
                        this.isWithMessage = false; 
                        this.isReloading = false;                        
                    }.bind( this ), 3500); 

                    this.emitter.emit( 'end-reload', oPositionObject);

                } else {

                    this.isReloading = false;
                    this.emitter.emit( 'end-reload', oPositionObject);
                }               
            }             
        },

        beforeDestroy() {
            if ( this.map ) {
                this.map.remove();
            }
        },     
    
    };
</script>

<template>
   <div class='app__main-container--map' id='mapContainer' v-if='renderMap'>
        <div class='reloadComponent' v-bind:class='{ reloadComponentShow: isReloading }'>
            <img :src='getReloadGif()' alt='' class='reloadComponent--gif'>             
            <div id="accuracyBox" class="accuracyBox">
                <svg class="svgSpriteBox">
                    <use xlink:href="#mapArrow"></use>
                </svg>
                <span>
                    Präzision: 
                    <span id="accuracyBoxValue" class="accuracyBox--value"></span> 
                    Meter.
                </span>
            </div>
        </div>
        <div class='messageBox' v-bind:class='{ messageBoxShow: isWithMessage }'>
            <h2 class='messageBox--title' ref='messageBoxTitle'></h2>
            <p class='messageBox--text' ref='messageBoxText'></p>
        </div>        
   </div>
</template>