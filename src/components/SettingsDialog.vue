<script>
     import { ref } from 'vue'

    export default {       
        el: '#settingsDialog',
        name: "SettingsDialog",        
        data: () => ({ 
            isShowSettings: false,
            aSettingsOptions: ref ([
                { 
                    trackingInterval: '10Sek.',
                    value: 10000,
                    checked: false,
                }, 
                { 
                    trackingInterval: '20Sek.',
                    value: 20000,
                    checked: false,
                },
                { 
                    trackingInterval: '30Sek.',
                    value: 30000,
                    checked: false,
                },
                { 
                    trackingInterval: '40Sek.',
                    value: 40000,
                    checked: false,
                },
                { 
                    trackingInterval: '50Sek.',
                    value: 50000,
                    checked: false,
                },
                { 
                    trackingInterval: '60Sek.',
                    value: 60000,
                    checked: false,
                },
                { 
                    trackingInterval: 'Ständig',
                    value: 'startWatchPosition',
                    checked: false,
                }, 
            ])
        }),
        methods: {
            onSetIntervalValue(event) {
                this.oSelectedInterval = {
                    "text": event.target.id,
                    "value": event.target.value                    
                }
            },

            onConfirmSettings() {
                const storedInterval = JSON.parse(window.localStorage.getItem("SelectedTrackingInterval"));

                // If this.oSelectedInterval === undefined Then the user has not made a new selection.
                if (this.oSelectedInterval !== undefined && this.oSelectedInterval.value !== storedInterval) {
                    console.log("Selected Tracking Interval", this.oSelectedInterval.value);

                    window.localStorage.setItem("SelectedTrackingInterval", JSON.stringify(this.oSelectedInterval));
                    this.isShowSettings = !this.isShowSettings;
                    this.emitter.emit("close-settings");

                    if (this.activeTracking === true) {
                        this.emitter.emit("restart-tracking");
                    }
                } else {
                    this.isShowSettings = !this.isShowSettings;
                    this.emitter.emit("close-settings");

                }
            }
        },
        created() {
            
        },
        beforeMount() {
            
        },
        mounted() { 

            setCheckedRadioButton.call(this);

            // Check if there's a stored tracking interval. If exists, set checked radio button.
            function setCheckedRadioButton() {
                let storedInterval = JSON.parse(window.localStorage.getItem("SelectedTrackingInterval"));

                if (storedInterval !== null) {
                    let storedIntervalValue = Number(storedInterval.value);

                    if (storedInterval !== null) {
                        this.aSettingsOptions.forEach(function(oItem) {
                            if (storedIntervalValue === oItem.value) {
                                oItem.checked = "checked";
                            }                        
                        })
                    }    
                }            
            }

            // Open settings dialog. (Triggered by Header.vue)
            this.emitter.on("open-settings", (bActiveTracking) => {    
                this.isShowSettings = !this.isShowSettings;
                // Get boolean from Header.vue to check if tracking is active
                this.activeTracking = bActiveTracking;
                console.log("Active tracking in settings", this.activeTracking);
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
                <input type="radio" :id="item.trackingInterval" class="radioButton" name="intervalSelect" :value="item.value" @click="onSetIntervalValue" :checked="item.checked">
                <label for="">{{ item.trackingInterval }}</label><br>
            </li>
        </ul>
        <button class="btn" @click="onConfirmSettings">
            Übernehmen
        </button>
    </div>
</template>