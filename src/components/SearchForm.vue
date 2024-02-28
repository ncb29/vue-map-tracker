<script>
    import { getGeoSearchData } from '@/data/GeoSearchData.js'
    import { getGeoRoutingData } from '@/data/GeoRoutingData.js'

    export default {      

        el: '#searchForm',
        name: 'searchForm', 

        data: () => ({ 
            isSearchOpen: false,
            isRoutingOpen: false,
        }),

        methods: {

            getGeoSearchData,
            getGeoRoutingData,

            resetSearchValue () {
                // The input is cleared automaticly by form reset button.
                this.$refs.searchInput.focus();
            },

            async submitSearchOrRouting () {

                this.emitter.emit( 'start-reload' );

                if ( this.isRoutingOpen === false ) {

                    const searchValue = this.$refs.searchInput.value;                
                    const searchData = await this.getGeoSearchData.call( this, searchValue );
                    this.emitter.emit( 'add-search-polygon', searchData );

                } else {

                    const routingStartValue = this.$refs.routingInputStart.value; 
                    const routingEndValue = this.$refs.routingInputEnd.value;     
                    let routingStartResult;
                    let routingEndResult;
                    
                    if ( routingStartValue !== '' ) {
                        routingStartResult = await this.getGeoSearchData.call( this, routingStartValue );
                    }

                    if ( routingEndValue !== '' ) {
                        routingEndResult = await this.getGeoSearchData.call( this, routingEndValue );
                    }

                    if ( routingStartResult && routingEndResult ) {
                        console.log("Routing Start:", routingStartResult[0], "Routing End", routingEndResult[0]);

                        const routingStartPoint = ''+routingStartResult[0].lon+','+routingStartResult[0].lat+'';
                        const routingEndPoint = ''+routingEndResult[0].lon+','+routingEndResult[0].lat+'';
                        this.getRoute.call( this, routingStartPoint, routingEndPoint ) 
                    }                    
                }   
            },


            toggleSearch () {
                this.emitter.emit( 'add-custom-map-class' );  
                this.isSearchOpen = true;

                if ( this.isRoutingOpen === false ) {
                    this.$refs.searchInput.focus();
                } else {
                    this.$refs.routingInputStart.focus();
                }                
            },


            closeSearch () {
                this.emitter.emit( 'remove-custom-map-class' );  
                this.isSearchOpen = false;
            },


            toggleRouting () {
                this.isRoutingOpen = !this.isRoutingOpen;

                if ( this.isRoutingOpen === false ) {
                    this.$refs.searchInput.focus();
                } else {
                    this.$refs.routingInputStart.focus();
                }   
            },

            
            async getRoute ( startPoint, endPoint ) {
                const routingData = await getGeoRoutingData( startPoint, endPoint );                  
                this.emitter.emit( 'show-route-on-map', routingData );
                this.closeSearch.call( this )
            }

        },

        created () {
            
        },

        beforeMount () {
            
        },

        mounted () { 

        }
    }
</script>

<template>
    <div class='app__main-container--search' v-bind:class='{ showSearch: isSearchOpen }, { routingIsOpen: isRoutingOpen }'>
        <form action='' class='app__main-container--search-form'>
            <div class='app__main-container--search-form-inputBox'>
                <div class='app__main-container--search-form-inputBox-input app__main-container--search-form-inputBox-location' v-bind:class='{ hideSearch: isRoutingOpen }'>
                    <input placeholder='Ort suchen' id="searchInput" ref="searchInput"/>
                    <input type="reset" value="X" @click='resetSearchValue()'>
                </div>  
                <div class='app__main-container--search-form-inputBox-routing' v-bind:class='{ showRouting: isRoutingOpen }'>
                    <div class='app__main-container--search-form-inputBox-input'>
                        <input placeholder='Start eingeben' id="routingInputStart" ref="routingInputStart"/>
                        <input type="reset" value="X" @click='resetSearchValue()'>
                    </div>
                    <div class='app__main-container--search-form-inputBox-input'>
                        <input placeholder='Ziel eingeben' id="routingInputEnd" ref="routingInputEnd"/>
                        <input type="reset" value="X" @click='resetSearchValue()'>
                    </div>
                </div>                   
                <!-- <svg class='app__main-container--search-form-inputBox-toggleRouting svgSpriteBox' @click='switchRoutingPoints()'>
                    <use xlink:href='#switch'></use>
                </svg>  -->
            </div>    
            <svg class='app__main-container--search-form-toggleRouting svgSpriteBox' @click='toggleRouting()'>
                    <use xlink:href='#routing'></use>
                </svg>         
            <svg class='app__main-container--search-form-submit svgSpriteBox' @click='submitSearchOrRouting()'>
                <use xlink:href='#searchGlass'></use>
            </svg>
        </form>            
        <div class='app__main-container--search-close' @click='closeSearch()'>
            <svg class='svgSpriteBox'>
                <use xlink:href='#closeCircle'></use>
            </svg>
        </div>            
    </div>    
    <div class='app__main-container--searchToggle' @click='toggleSearch()' v-bind:class='{ hideSearchToggle: isSearchOpen }'>
        <svg class='svgSpriteBox'>
            <use xlink:href='#searchMap'></use>
        </svg>
    </div>
</template>