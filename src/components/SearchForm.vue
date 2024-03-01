<script>
    import { getGeoSearchData } from '@/data/GeoSearchData.js'

    export default {      

        el: '#searchForm',
        name: 'searchForm', 

        data: () => ({ 
            isSearchOpen: false,
            isRoutingOpen: false,
            isRoutingTypeCar: false,
            isRoutingTypeBike: false,
            isRoutingTypeFoot: false,
            isSubmitDisabled: true,            
        }),

        methods: {

            getGeoSearchData,

            addInputEventListener () {
                // Add a eventlistener to search and routing inputs for detecting changes and toggle disabled submit button.
                const searchFormInputs = [this.$refs.searchInput, this.$refs.routingInputStart, this.$refs.routingInputEnd];

                searchFormInputs.forEach( function ( input ) {
                    
                    input.addEventListener("keyup", 
                        function () {
                            this.toggleDisableSubmitButton.call( this );
                        }.bind( this )
                    );

                }.bind( this ));
            },


            getStoredRoutingType () {
                let storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                if ( storedSettings.routingType === 'car' ) {
                    this.isRoutingTypeCar = true;
                } else if ( storedSettings.routingType === 'bike' ) {
                    this.isRoutingTypeBike = true;
                } else {
                    this.isRoutingTypeFoot = true;
                }                   
            },


            openSearch () {

                this.isSearchOpen = true;

                if ( this.isRoutingOpen === false ) {
                    this.$refs.searchInput.focus();
                } else {
                    this.$refs.routingInputStart.focus();
                }

                this.toggleDisableSubmitButton.call( this );
            },


            closeSearch () {
                this.emitter.emit( 'closed-search-map' );
                this.isSearchOpen = false;
            },


            resetSearchValue ( inputType ) {

                // The input is cleared automaticly by form reset button.
                if ( inputType === 'search' ) {
                    
                    this.$refs.searchInput.value = '';
                    this.$refs.searchInput.focus();

                } else if ( inputType === 'routing-start' ) {

                    this.$refs.routingInputStart.value = '';
                    this.$refs.routingInputStart.focus();

                } else {

                    this.$refs.routingInputEnd.value = '';
                    this.$refs.routingInputEnd.focus();
                }

                this.toggleDisableSubmitButton.call( this );
            },


            toggleDisableSubmitButton () {

                const searchInputValueLength = this.$refs.searchInput.value.length;
                const routingStartValueLength = this.$refs.routingInputStart.value.length;
                const routingEndValueLength = this.$refs.routingInputEnd.value.length;

                console.log("searchInputValue", searchInputValueLength)

                if ( this.isRoutingOpen === false ) {

                    if ( searchInputValueLength > 0 ) {
                        this.isSubmitDisabled = false;
                    } else {
                        this.isSubmitDisabled = true;
                    }

                } else {

                    if ( routingStartValueLength > 0 && routingEndValueLength > 0 ) {
                        this.isSubmitDisabled = false;
                    } else {
                        this.isSubmitDisabled = true;
                    }

                }
            },

            async submitSearchOrRouting () {

                this.emitter.emit( 'trigger-reload' );
               
                if ( this.isRoutingOpen === false ) {
                     // Search is single location.

                    const searchValue = this.$refs.searchInput.value;                
                    const searchData = await this.getGeoSearchData.call( this, searchValue );
                    this.emitter.emit( 'show-location-search-result', searchData );

                } else {
                     // Search is of type route.

                    const routingStartValue = this.$refs.routingInputStart.value; 
                    const routingEndValue = this.$refs.routingInputEnd.value;     

                    if ( routingStartValue !== '' && routingEndValue !== '' ) {

                        const routingValues = [routingStartValue, routingEndValue];
                        let routingPointsResults = [];

                        routingValues.forEach( async function ( value ) {
                            
                            let routingPointResult = await this.getGeoSearchData.call( this, value );
                            routingPointsResults.push( [routingPointResult[0].lat, routingPointResult[0].lon] )

                            if ( routingPointsResults.length > 1 ) {
                                this.emitter.emit( 'show-route-on-map', routingPointsResults );
                            }
                            
                        }.bind( this ));

                        this.closeSearch.call( this );  
                    }        
                }   
            },


            toggleRouting () {

                this.isRoutingOpen = !this.isRoutingOpen;

                if ( this.isRoutingOpen === false ) {
                    this.$refs.searchInput.focus();
                } else {
                    this.$refs.routingInputStart.focus();
                }   

                this.toggleDisableSubmitButton.call( this );
            },


            setRoutingType ( selectedRoutingType ) {

                if ( selectedRoutingType === 'car' ) {

                    this.isRoutingTypeCar = true;
                    this.isRoutingTypeBike = false;
                    this.isRoutingTypeFoot = false;

                } else if ( selectedRoutingType === 'bike' ) {

                    this.isRoutingTypeBike = true;
                    this.isRoutingTypeCar = false;
                    this.isRoutingTypeFoot = false;

                } else {

                    this.isRoutingTypeFoot = true;
                    this.isRoutingTypeCar = false;
                    this.isRoutingTypeBike = false;
                }

                let storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );
                storedSettings.routingType = selectedRoutingType;
                window.localStorage.setItem( 'StoredSettings', JSON.stringify( storedSettings ) );
            },
        },

        created () {
           
        },

        beforeMount () {
            
        },

        mounted () { 


            this.addInputEventListener.call( this );
            this.getStoredRoutingType.call( this );
            

            this.emitter.on( 'open-search', () => {   
                this.openSearch.call( this );                 
            }); 


            this.emitter.on( 'close-search', () => {    
                this.closeSearch.call( this ); 
            });
        }
    }
</script>

<template>  
    <div class='app__main-container--search' v-bind:class='{ showSearch: isSearchOpen }, { routingIsOpen: isRoutingOpen }'>
        <div class='app__main-container--search-header'> 
            <div class='app__main-container--search-header-titleBox'>
                <h3 class='app__main-container--search-header-titleBox-title' v-bind:class='{ hideTitle: isRoutingOpen }'>
                    Suche Lokation
                </h3>
                <h3 class='app__main-container--search-header-titleBox-title' v-bind:class='{ hideTitle: !isRoutingOpen }'>
                    Suche Route
                </h3>
                <svg class='app__main-container--search-form-toggleRouting svgSpriteBox' v-bind:class='{ hideSearchTypeIcon: isRoutingOpen }' @click='toggleRouting()'>
                    <use xlink:href='#routing'></use>
                </svg>  
                <svg class='app__main-container--search-form-toggleRouting svgSpriteBox' v-bind:class='{ hideSearchTypeIcon: !isRoutingOpen }' @click='toggleRouting()'>
                    <use xlink:href='#magnifyingGlass'></use>
                </svg>  
            </div>            
            <div class='app__main-container--search-close' @click='closeSearch()'>
                <svg class='svgSpriteBox'>
                    <use xlink:href='#closeCircle'></use>
                </svg>
            </div> 
        </div>          
        <form action='' class='app__main-container--search-form'>
            <div class='app__main-container--search-form-inputBox'>
                <div class='app__main-container--search-form-inputBox-input app__main-container--search-form-inputBox-location' v-bind:class='{ hideSearch: isRoutingOpen }'>
                    <input placeholder='Ort suchen' id="searchInput" ref="searchInput"/>
                    <input type="button" value="X" @click='resetSearchValue( "search" )'>
                </div>  
                <div class='app__main-container--search-form-inputBox-routing'  v-bind:class='{ showRouting: isRoutingOpen }'>
                    <div class='app__main-container--search-form-inputBox-input'>
                        <input placeholder='Start eingeben' id="routingInputStart" ref="routingInputStart"/>
                        <input type="button" value="X" @click='resetSearchValue( "routing-start" )'>
                    </div>
                    <div class='app__main-container--search-form-inputBox-input'>
                        <input placeholder='Ziel eingeben' id="routingInputEnd" ref="routingInputEnd"/>
                        <input type="button" value="X" @click='resetSearchValue( "routing-end" )'>
                    </div>
                    <div class='app__main-container--search-form-inputBox-routing-typeSelect'>
                        <div class='app__main-container--search-form-inputBox-routing-typeOption' v-bind:class='{ activeRoutingType: isRoutingTypeCar }' @click='setRoutingType( "car" )'>
                            <svg class='svgSpriteBox'>
                                <use xlink:href='#car'></use>
                            </svg>
                        </div>
                        <div class='app__main-container--search-form-inputBox-routing-typeOption' v-bind:class='{ activeRoutingType: isRoutingTypeBike }' @click='setRoutingType( "bike" )'>
                            <svg class='svgSpriteBox'>
                                <use xlink:href='#bike'></use>
                            </svg>
                        </div>
                        <div class='app__main-container--search-form-inputBox-routing-typeOption' v-bind:class='{ activeRoutingType: isRoutingTypeFoot }' @click='setRoutingType( "foot" )'>
                            <svg class='svgSpriteBox'>
                                <use xlink:href='#foot'></use>
                            </svg>
                        </div>
                    </div>
                </div>                   
                <!-- <svg class='app__main-container--search-form-inputBox-toggleRouting svgSpriteBox' @click='switchRoutingPoints()'>
                    <use xlink:href='#switch'></use>
                </svg>  -->
            </div> 
            <button class='app__main-container--search-form-submit btn btn--icon' type="button" @click='submitSearchOrRouting()' :disabled='isSubmitDisabled'>
                <svg class='svgSpriteBox'>
                    <use xlink:href='#searchGlass'></use>
                </svg>
            </button>                          
        </form>           
    </div>   
</template>