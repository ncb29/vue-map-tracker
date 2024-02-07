<script>
     import { ref } from 'vue'

    export default {       
        el: '#settingsDialog',
        name: 'SettingsDialog',        
        data: () => ({ 
            isShowSettings: false,
            isPreciseMode: false,
            aIntervalOptions: ref ([
                { 
                    intervalText: '5 Sek.',
                    intervalValue: 5000,
                    checked: false,
                }, 
                { 
                    intervalText: '10 Sek.',
                    intervalValue: 10000,
                    checked: false,
                }, 
                { 
                    intervalText: '20 Sek.',
                    intervalValue: 20000,
                    checked: false,
                },
                { 
                    intervalText: '30 Sek.',
                    intervalValue: 30000,
                    checked: false,
                },
                { 
                    intervalText: '40 Sek.',
                    intervalValue: 40000,
                    checked: false,
                },
                { 
                    intervalText: '50 Sek.',
                    intervalValue: 50000,
                    checked: false,
                },
                { 
                    intervalText: '60 Sek.',
                    intervalValue: 60000,
                    checked: false,
                },
                { 
                    intervalText: 'Ständig',
                    intervalValue: 'startWatchPosition',
                    checked: false,
                }, 
            ])
        }),
        methods: {

            // Check if there's a stored tracking interval. If exists, set checked radio button.
            getSettingsFromStorage() {

                let storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                if ( storedSettings !== null ) {

                    let nStoredSettingsValue = Number( storedSettings.intervalValue );

                    if ( nStoredSettingsValue !== null ) {

                        this.aIntervalOptions.forEach(function( oItem ) {
                            if ( nStoredSettingsValue === oItem.intervalValue ) {
                                oItem.checked = 'checked';
                            }                        
                        })
                    }    

                    if ( storedSettings.preciseMode !== undefined ) {
                        this.isPreciseMode = storedSettings.preciseMode;
                    }
                }            
            },

            onSetPreciseMode() {
                this.isPreciseMode = !this.isPreciseMode;
                console.log("New Mode decision", this.isPreciseMode)
            },

            onSetIntervalValue( event ) {
                this.oSelectedInterval = {
                    'intervalText': event.target.id,
                    'intervalValue': event.target.value                    
                }
            },

            onConfirmSettings() {

                let storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                // If this.oSelectedInterval === undefined Then the user has not made a new selection.
                if ( (this.oSelectedInterval !== undefined && this.oSelectedInterval.intervalValue !== storedSettings.intervalValue) ) {

                    console.log( 'Selected Tracking Interval', this.oSelectedInterval.intervalValue );

                    // Use only two first digits of interval value for seconds counter
                    // Before check if value has more then 4 digits. If true then keep 2 digits else keep 1 one digit (e.g 5sec)
                    let sIntervalValue = this.oSelectedInterval.intervalValue.toString().length;

                    if ( sIntervalValue > 4 ) {
                        storedSettings.valueInSec = this.oSelectedInterval.intervalValue.substring( 0, 2 );
                    } else {
                        storedSettings.valueInSec = this.oSelectedInterval.intervalValue.substring( 0, 1 );
                    }   

                    storedSettings.intervalText = this.oSelectedInterval.intervalText;
                    storedSettings.intervalValue = this.oSelectedInterval.intervalValue;

                    window.localStorage.setItem( 'StoredSettings', JSON.stringify( storedSettings ) );

                    if ( this.isCurrentTracking === true ) {
                        this.emitter.emit( 'restart-tracking' );
                    }

                } 
                
                if ( this.isPreciseMode !== storedSettings.preciseMode ) {

                    storedSettings.preciseMode = this.isPreciseMode;
                    window.localStorage.setItem( 'StoredSettings', JSON.stringify( storedSettings ) );

                    if ( this.isCurrentTracking === true ) {
                        this.emitter.emit( 'restart-tracking' );
                    }

                } 
                
                this.isShowSettings = !this.isShowSettings;
                this.emitter.emit( 'close-settings' );
            }
        },
        created() {
            
        },
        beforeMount() {
            
        },
        mounted() { 

            // Open settings dialog. (Triggered by Header.vue)
            this.emitter.on( 'open-settings', ( bActiveTracking ) => {    
                this.isShowSettings = !this.isShowSettings;
                this.getSettingsFromStorage.call( this );
                // Get boolean from Header.vue to check if tracking is active
                this.isCurrentTracking = bActiveTracking;
                console.log( 'Active tracking in settings', this.isCurrentTracking );
            });           
        }
    }
</script>

<template>
    <div class='app__main-container--settingsDialog' v-bind:class='{ showSettingsDialog: isShowSettings }' id='settingsDialog'>
        <h2>Einstellungen</h2>
        <div class='app__main-container--settingsDialog-PreciseMode'>
            <input type='checkbox' id='preciseMode' class='checkBox' name='preciseMode' :value='this.isPreciseMode' @click='onSetPreciseMode' :checked='this.isPreciseMode'>
            <label for='preciseMode'>Präziser Modus</label><br>
        </div>
        <span class='app__main-container--settingsDialog-List-Title'>Tracking Intervall</span>
        <ul class='app__main-container--settingsDialog-List'>
            <li v-for='item in aIntervalOptions'>
                <input type='radio' :id='item.intervalText' class='radioButton' name='intervalSelect' :value='item.intervalValue' @click='onSetIntervalValue' :checked='item.checked'>
                <label for='intervalSelect'>{{ item.intervalText }}</label><br>
            </li>
        </ul>
        <button class='btn' @click='onConfirmSettings'>
            Übernehmen
        </button>
    </div>
</template>