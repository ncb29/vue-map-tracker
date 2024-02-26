<script>
    import { getGeoSearchData } from '@/data/GeoSearchData.js'

    export default {      

        el: '#searchForm',
        name: 'searchForm', 

        data: () => ({ 
            isSearchOpen: false,
        }),

        methods: {

            getGeoSearchData,

            async submitSearch () {
                const searchValue = this.$refs.searchInput.value;                
                console.log("Search value", searchValue)
                let searchData = await this.getGeoSearchData.call( this, searchValue )
                console.log("Search Data", searchData);

                this.emitter.emit( 'add-search-polygon', searchData );
            },


            toggleSearch () {
                this.emitter.emit( 'add-custom-map-class' );  
                this.isSearchOpen = true;
                this.$refs.searchInput.focus();
            },


            closeSearch () {
                this.emitter.emit( 'remove-custom-map-class' );  
                this.isSearchOpen = false;
            }

        },

        created() {
            
        },

        beforeMount() {
            
        },

        mounted() { 

              
        }
    }
</script>

<template>
    <div class='app__main-container--search' v-bind:class='{ showSearch: isSearchOpen }'>
        <div class='app__main-container--search-form'>
            <input placeholder='Ort suchen' id="searchInput" ref="searchInput"/>
            <svg class='app__main-container--search-submit svgSpriteBox' @click='submitSearch()'>
                <use xlink:href='#searchGlass'></use>
            </svg>
        </div>
        <div class='app__main-container--search-close' @click='closeSearch()'>
            X
        </div>            
    </div>    
    <div class='app__main-container--searchToggle' @click='toggleSearch()' v-bind:class='{ hideSearchToggle: isSearchOpen }'>
        <svg class='svgSpriteBox'>
            <use xlink:href='#searchMap'></use>
        </svg>
    </div>
</template>