<script>
    import { ref } from 'vue'
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import { icon, Marker } from 'leaflet';
    import MainMarker from '@/assets/icons/main-marker.svg'
    import SecondMarker from '@/assets/icons/secondary-marker.svg'

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
            isReloading: true,
            isWithMessage: false,
            isPreciseMode: false,
        }),
        methods: {

            getReloadGif() {

                if ( location.hostname === 'localhost' || location.hostname === '127.0.0.1' ) {
                    return new URL('../assets/gifs/reload-spinner.gif', import.meta.url).href
                } else {
                    return new URL('/map-tracker/assets/reload-spinner.gif', import.meta.url).href
                }    

            },

            getPreciseMode() {
                const storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) )
                this.isPreciseMode = storedSettings.preciseMode;
            }
        },
        created() {

        },
        mounted() {     
            
            this.getPreciseMode();

            
            this.emitter.on( 'start-reload', () => {    
                this.isReloading = !this.isReloading;  
            });


            this.emitter.on( 'update-components', ( oPositionObject ) => {  
                
                // Check if the new position object has a message
                if ( Object.keys( oPositionObject.message ).length !== 0 && oPositionObject.message.constructor === Object ) {
                    //Set text in message box title
                    this.$el.childNodes[1].childNodes[0].innerHTML = oPositionObject.message.title;  
                    //Set text in message box paragraph
                    this.$el.childNodes[1].childNodes[1].innerHTML = oPositionObject.message.text;  

                    this.isWithMessage = !this.isWithMessage; 
                }
                this.getPreciseMode();
                renderMap.call( this, oPositionObject );                 
            });


            function renderMap( oPositionObject ) {

                console.log( 'oPositionObject', oPositionObject )

                // Safe current position object to reuse it in header (vue global variables needs a lot of extra code)
                window.oCurrentPositionObject = oPositionObject;

                // Define marker settings
                const iconRetinaUrl = MainMarker;
                const iconDefault = icon({
                    iconRetinaUrl,
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
                if ( oPositionObject !== null && ( Object.keys( oPositionObject ).length !== 0 && oPositionObject.constructor === Object ) ) {

                    this.latlng = [ ''+oPositionObject.latitude+'', ''+oPositionObject.longitude+'' ];                     

                } else {

                    // Set fallback geo data
                    this.latlng = [ '53.5560767', '9.9284123' ]; 
                }                 

                if ( this.latlng ) {

                    // No map was already rendered. Create new map
                    if ( !this.map ) {

                        this.map = L.map( 'mapContainer', {
                            center: this.latlng,
                            zoom: 18,
                        });

                        L.tileLayer( 'https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
                            maxNativeZoom: 18,
                            maxZoom: 18,
                        }).addTo( this.map );

                        // Set a marker to map (current client position)
                        // oPositionObject.stateNewMarker = true;
                        if ( oPositionObject.stateNewMarker === true ) {

                            new L.Marker( this.latlng ).addTo( this.map );
                            console.log( 'New Map this.latlng', this.latlng );

                        } else {
                            console.log( 'No initial marker' );                            
                        }
                        
                        console.log( 'Layers after creation', this.map._layers );
                        
                    } else {

                        // Set a new center and marker to map (current client position) if allowed.
                        // oPositionObject.stateNewMarker = true;
                        if ( oPositionObject.stateNewMarker === true ) {

                            console.log( 'Existing Layers', this.map._layers );

                            if ( oPositionObject.trackingType === 'single' ) {

                                // If tracking type is single, remove the last setted layer. We can achieve it to ask for a GeoJson layer.
                                // This must be true, because there only one former geo layer.
                                this.map.eachLayer(function( layer ){
                                    if ( !!layer.toGeoJSON ) {
                                        this.map.removeLayer( layer );  
                                    }                                  
                                }.bind( this ));
                                
                                // Create the new marker
                                this.map.panTo( new L.LatLng( this.latlng[0], this.latlng[1] ) );
                                new L.Marker( this.latlng ).addTo( this.map );

                            } else {

                                // If tracking type is 'multiple' change the icon from last setted marker to blue one.
                                let oLastSettedMapLayer = this.map._layers[ Object.keys( this.map._layers )[ Object.keys( this.map._layers ).length - 1 ] ]; // Get the last layer object of all layers

                                if ( ( oLastSettedMapLayer !== undefined && oLastSettedMapLayer !== null ) && !!oLastSettedMapLayer.toGeoJSON ) {
                                    let oLastSettedMapLayerIcon = oLastSettedMapLayer._icon; // Get the icon from last layer
                                    oLastSettedMapLayerIcon.setAttribute( 'src', SecondMarker ); // Change the Icon src
                                    oLastSettedMapLayerIcon.classList.remove( 'active-marker' );
                                }                                

                                // Create the new marker
                                this.map.panTo( new L.LatLng( this.latlng[0], this.latlng[1] ) );
                                new L.Marker( this.latlng ).addTo( this.map );

                                oLastSettedMapLayer = this.map._layers[ Object.keys( this.map._layers )[ Object.keys( this.map._layers ).length - 1 ] ]; // Get the last layer object of all layers
                                let oLastSettedMapLayerIcon = oLastSettedMapLayer._icon; // Get the icon from last layer
                                oLastSettedMapLayerIcon.classList.add( 'active-marker' );

                            }
                            
                        } else {
                            console.log( 'No new marker' )
                        }
                    }                 
                }        

                console.log("Tracking Status:", oPositionObject.trackingStatus, "Tracking Type:", oPositionObject.trackingType)
                               
                if ( this.isWithMessage === true ) {

                    setTimeout(function () {                           
                        this.isWithMessage = !this.isWithMessage; 
                        this.isReloading = !this.isReloading;
                    }.bind( this ), 3500); 

                } else {
                    this.isReloading = !this.isReloading;
                } 
                
                // After reloading map, send an update to header component to stop and restart tracking interval.
                // This guarantees that new geo data is called in interval, when map reload stopped.
                if ( oPositionObject.trackingType === 'multiple' && oPositionObject.trackingStatus !== 'stopped' ) {
                    this.emitter.emit( 'end-reload');
                }
            }             
        },
        beforeMount() {

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
            <div id="accuracyBox" class="accuracyBox" v-bind:class='{ showAccuracy: isPreciseMode }'></div>
        </div>
        <div class='messageBox' v-bind:class='{ messageBoxShow: isWithMessage }'>
            <h2 class='messageBox--title'></h2>
            <p class='messageBox--text'></p>
        </div>        
   </div>
</template>