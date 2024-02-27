<script>
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import { icon, Marker } from 'leaflet';
    import { MiniMap } from 'leaflet-control-mini-map';
    import { getGeoPosition } from '@/data/GeoPosition.js'
    import { getGeoPositionInfo } from '@/data/GeoPositionInfo.js'
    import MainMarker from '@/assets/icons/main-marker.svg'
    import SecondMarker from '@/assets/icons/secondary-marker.svg'
    import DestinationMarker from '@/assets/icons/destination-marker.svg'

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


            getReloadGif() {

                if ( location.hostname === 'localhost' || location.hostname === '127.0.0.1' ) {
                    return new URL('../assets/gifs/reload-spinner.gif', import.meta.url).href
                } else {
                    return new URL('/map-tracker/assets/reload-spinner.gif', import.meta.url).href
                }    
            },


            getTrackingMode() {
                const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
                this.isPreciseMode = storedSettings.preciseMode;
            },


            onRemoveMarkerLayers() {
                this.map.eachLayer(function( layer ){
                    if ( layer.type === 'markerLayer' ) {
                        this.map.removeLayer( layer );  
                    }                                  
                }.bind( this ));
            },


            setMarkerOnMap( latlng, oPositionObject ) {
                this.map.panTo( new L.LatLng( latlng[0], latlng[1] ) );

                let newMarker = new L.Marker( latlng ).addTo( this.map ).bindPopup('', { direction: 'right' } ).on( 'popupopen', 
                function ( popup ) {
                    this.getPopUpContent( popup, oPositionObject.timestamp, newMarker )
                }.bind( this ));

                // Set a custom type. For deleting
                newMarker.type = 'markerLayer';
            },


            async getPopUpContent(popup, nPositionTimestamp, newMarker) {
                const geoData = await this.getGeoPositionInfo.call( this, nPositionTimestamp, popup.sourceTarget._latlng )
                newMarker.setPopupContent( geoData );
            },


            createSearchResultLayer( oSearchResult ) {
                let searchResultLayer = {};

                // Remove existing polygon layer before set a new one.
                this.map.eachLayer(function( layer ){
                    if ( layer.type === 'searchLayer' ) {
                        this.map.removeLayer( layer );  
                    }                                  
                }.bind( this ));

                // Set a new search layer
                if ( oSearchResult && oSearchResult[0].geojson.type !== 'Point' ) {

                    searchResultLayer = L.geoJson( oSearchResult[0].geojson,
                        {
                            style: function () {
                                return { interactive: false, color: '#d40e0c' };
                            }
                        }
                    );

                    let newDestinationMarker = new L.Marker( [oSearchResult[0].lat, oSearchResult[0].lon] ).addTo( this.map );
                    newDestinationMarker._icon.setAttribute( 'src', DestinationMarker );
                    newDestinationMarker._icon.classList.remove( 'active-marker' );
                    newDestinationMarker._icon.classList.add( 'destination-marker' );
                    newDestinationMarker.type = 'searchLayer';

                } else {

                    searchResultLayer = L.geoJson( oSearchResult[0].geojson );  
                    let newSearchLayer = searchResultLayer._layers[ Object.keys( searchResultLayer._layers )[ Object.keys( searchResultLayer._layers ).length - 1 ] ]; // Get the last layer object of all layers
                    let newSearchLayerIcon = newSearchLayer.options.icon.options; // Get the icon from last layer
                    newSearchLayerIcon.iconUrl = DestinationMarker;
                    newSearchLayerIcon.className = 'destination-marker';               
                }     
                
                console.log("Search Result Layer", searchResultLayer)

                this.map.addLayer( searchResultLayer );
                this.map.fitBounds( searchResultLayer.getBounds() );
                this.map.panTo( new L.LatLng( oSearchResult[0].lat, oSearchResult[0].lon ) );

                searchResultLayer.type = 'searchLayer';

                setTimeout(function () {                           
                    this.isReloading = false;                        
                }.bind( this ), 1000);                 

                console.log( 'Layers after search', this.map._layers );
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

            this.emitter.emit( 'initial-track' );
            

            this.getTrackingMode();


            this.emitter.on( 'close-settings', () => {  
                this.getTrackingMode();             
            });            


            this.emitter.on( 'end-tracking', ( oPositionObject ) => {  
                
                // Check if the new position object has a message
                if ( Object.keys( oPositionObject.message ).length !== 0 && oPositionObject.message.constructor === Object ) {
                    //Set text in message box title
                    this.$el.childNodes[1].childNodes[0].innerHTML = oPositionObject.message.title;  
                    //Set text in message box paragraph
                    this.$el.childNodes[1].childNodes[1].innerHTML = oPositionObject.message.text;  

                    this.isWithMessage = !this.isWithMessage; 
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
                this.isReloading = true;

                if ( this.map && oSearchResult !== undefined ) {                    
                    this.createSearchResultLayer.call( this, oSearchResult )                   
                }
            });          

            

             /**
             * Render map function
             * It's called multiple in tracking circle
             * @param {*} oPositionObject 
             */
            function renderMap( oPositionObject ) {

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
                    className: 'active-marker',
                });
                Marker.prototype.options.icon = iconDefault;

                this.latlng = [];                      

                // Check if the new position object is not null, of type object and is not empty.
                if ( oPositionObject !== null && Object.keys( oPositionObject ).length !== 0  ) {

                    this.latlng = [ ''+oPositionObject.latitude+'', ''+oPositionObject.longitude+'' ];   

                } else {

                    // Set fallback geo data
                    this.latlng = [ '53.5560767', '9.9284123' ]; 
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
                            zoom: 19,
                            zoomAnimation: true,
                            fadeAnimation: true,
                            markerZoomAnimation: true,                            
                        });


                        const tileLayerUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';

                        const tileLayer = new L.TileLayer( tileLayerUrl, {
                            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
                            maxNativeZoom: 19,
                            maxZoom: 19,
                        }).addTo( this.map );


                        // Add minimap to map
                        const miniMapOptions = {
                            toggleDisplay: true,
                            minimized: true,
                            position: 'bottomright',
                            collapsedWidth: 29,
                            collapsedHeight: 29,
                            zoomLevelOffset: -4,
                        }
                        const miniMapTileLayer = new L.TileLayer( tileLayerUrl, { minZoom: 10, maxZoom: 19 });
                        const miniMap = new L.Control.MiniMap( miniMapTileLayer, miniMapOptions ).addTo( this.map );
                        
                        // Custom minimap class added by toggle
                        miniMap.addEventListener("restore", function() {                            
                            miniMap._map.setView( this.map._lastCenter )
                            console.log("this.map", this.map);
                            console.log("miniMap", miniMap);
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
                                    
                                    if ( layer.type === 'markerLayer' ) {

                                        if ( layer._source !== undefined ) {
                                            layer._source.togglePopup(); 
                                        }
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
            <div id="accuracyBox" class="accuracyBox" v-bind:class='{ showAccuracy: isPreciseMode }'>
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
            <h2 class='messageBox--title'></h2>
            <p class='messageBox--text'></p>
        </div>        
   </div>
</template>