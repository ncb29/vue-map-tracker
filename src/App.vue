<script>
    import { ref } from 'vue'
    import SvgSprite from './components/SvgSprite.vue'  
    import Header from './components/Header.vue'
    import Map from './components/Map.vue'
    import Footer from './components/Footer.vue'
    import SearchForm from './components/SearchForm.vue'
    import SettingsDialog from './components/SettingsDialog.vue'   

    export default {
        name: 'App',
        components: {
            SvgSprite,
            Header,
            SearchForm,
            SettingsDialog,
            Map,
            Footer           
        },
    };
</script>

<template>
    <SvgSprite />
    <Header></Header>
    <SearchForm></SearchForm>
    <SettingsDialog></SettingsDialog>
    <Map></Map>
    <Footer></Footer>    
</template>

