<script>
     import { ref } from 'vue'

    export default {       
        el: '#settingsDialog',
        name: "SettingsDialog",
        methods: {
            
        },
        data: () => ({ 
            isShowSettings: false,
            aSettingsOptions: ref ([
                { 
                    trackingInterval: '10Sek.',
                    value: 10000
                }, 
                { 
                    trackingInterval: '20Sek.',
                    value: 20000
                },
                { 
                    trackingInterval: '30Sek.',
                    value: 30000
                },
                { 
                    trackingInterval: '40Sek.',
                    value: 40000
                },
                { 
                    trackingInterval: '50Sek.',
                    value: 50000
                },
                { 
                    trackingInterval: '60Sek.',
                    value: 60000
                },
                { 
                    trackingInterval: 'Ständig.',
                    value: 'startWatchPosition'
                }, 
            ])
        }),
        created() {

        },
        beforeMount() {

        },
        mounted() {            
            this.emitter.on("open-settings", () => {    
                this.isShowSettings = !this.isShowSettings;
            });
           
        }
    }
</script>

<template>
    <div class="app__main-container--settingsDialog" v-bind:class="{showSettingsDialog: isShowSettings}" id="settingsDialog">
        <h2>Einstellungen</h2>
        <span class="app__main-container--settingsDialog-List-Title">Tracking Intervall</span>
        <ul class="app__main-container--settingsDialog-List">
            <li v-for="item in aSettingsOptions">
                <input type="radio" id="html" class="radioButton" name="fav_language" value="HTML">
                <label for="html">{{ item.trackingInterval }}</label><br>
            </li>
        </ul>
    </div>
</template>