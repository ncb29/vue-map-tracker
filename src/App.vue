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
            Map,
            Footer,
            SearchForm,
            SettingsDialog,
        },
    };
</script>

<template>
    <SvgSprite />
    <Header></Header>
    <Map></Map>
    <Footer></Footer>
    <SearchForm></SearchForm>
    <SettingsDialog></SettingsDialog>
</template>

