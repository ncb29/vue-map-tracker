<script>
     import { ref } from 'vue'
     import Options from '@/data/SettingOptions.json'

    export default {      

        el: '#settingsDialog',
        name: 'SettingsDialog', 

        data: () => ({ 
            isShowSettings: false,
            isPreciseMode: false,
            isCurrentTracking: false,
            aToleranceOptions: ref(Options[0].toleranceOptions),
            aIntervalOptions: ref(Options[1].intervalOptions)
        }),

        methods: {


            // Check if there's a stored tracking interval. If exists, set checked radio button.
            getSettingsFromStorage () {

                let storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                if ( storedSettings !== null ) {

                    let nStoredIntervalValue = Number( storedSettings.intervalValue );
                    let nStoredToleranceValue = Number( storedSettings.preciseToleranceValue );

                    if ( nStoredIntervalValue !== null ) {

                        this.aIntervalOptions.forEach(function( oItem ) {

                            if ( nStoredIntervalValue === oItem.intervalValue ) {
                                oItem.checked = 'checked';
                            }        

                        })
                    }    

                    if ( storedSettings.preciseMode !== undefined ) {

                        this.isPreciseMode = storedSettings.preciseMode;
                    }

                    if ( nStoredToleranceValue !== null ) {

                        this.aToleranceOptions.forEach(function( oOption ) {

                            if ( nStoredToleranceValue === Number(oOption.toleranceValue) ) {
                                oOption.selected = 'selected';
                            }

                        })
                    }  
                }            
            },


            onSetPreciseMode () {

                this.isPreciseMode = !this.isPreciseMode;
                console.log("New Mode decision", this.isPreciseMode)
            },


            onSelectPreciseTolerance ( event ) {

                this.sSelectedTolerance = {
                    'value': event.target.value,
                    'text': event.target.selectedOptions[0].innerText
                }             
            },


            onSetIntervalValue ( event ) {

                this.oSelectedInterval = {
                    'intervalText': event.target.id,
                    'intervalValue': event.target.value                    
                }
            },


            onConfirmSettings () {

                let storedSettings = JSON.parse( window.localStorage.getItem( 'StoredSettings' ) );

                // If this.oSelectedInterval === undefined Then the user has not made a new selection.
                if ( ( this.oSelectedInterval !== undefined && this.oSelectedInterval.intervalValue !== storedSettings.intervalValue ) ) {

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

                if ( this.sSelectedTolerance !== undefined &&  this.sSelectedTolerance !== '' ) {

                    storedSettings.preciseToleranceValue = this.sSelectedTolerance.value;
                    storedSettings.preciseToleranceText = this.sSelectedTolerance.text;
                    window.localStorage.setItem( 'StoredSettings', JSON.stringify( storedSettings ) );
                } 
                
                this.isShowSettings = false;
                this.emitter.emit( 'close-settings' );
            }
        },

        created () {
            
        },

        beforeMount () {
            
        },

        mounted () { 

            // Open settings dialog. (Triggered by Header.vue)
            this.emitter.on( 'toggle-settings', ( bOpen, bActiveTracking ) => {    

                this.isShowSettings = !this.isShowSettings;
                this.getSettingsFromStorage.call( this );

                // Get boolean from Header.vue to check if tracking is active
                this.isCurrentTracking = bActiveTracking;

                if ( bOpen === false ) {                    
                    this.emitter.emit( 'close-settings' );
                }                

                console.log( 'Active tracking in settings', this.isCurrentTracking );
            });           
        }
    }
</script>

<template>
    <div class='app__main-container--settingsDialog' v-bind:class='{ showSettingsDialog: isShowSettings }' id='settingsDialog'>
        <h2>Einstellungen</h2>
        <h4 class='app__main-container--settingsDialog-subtitle'>Präzisionsmodus</h4>
        <div class='app__main-container--settingsDialog-preciseMode'>
            <div class='app__main-container--settingsDialog-preciseMode-check'>
                <input type='checkbox' id='preciseMode' class='checkBox' name='preciseMode' :value='this.isPreciseMode' @click='onSetPreciseMode' :checked='this.isPreciseMode' :disabled='this.isCurrentTracking'>
                <label for='preciseMode'>
                    Aktiv
                </label>
            </div>  
            <select class='app__main-container--settingsDialog-preciseMode-select' id='toleranceSelect' v-bind:class='{ showSelect: isPreciseMode }' @change='onSelectPreciseTolerance'>
                <option v-for='option in aToleranceOptions' :value='option.toleranceValue' :selected="option.selected === 'selected'">
                    {{ option.toleranceText }}
                </option>
            </select>          
        </div>
        <h4 class='app__main-container--settingsDialog-subtitle'>Tracking Intervall</h4>
        <ul class='app__main-container--settingsDialog-list'>
            <li v-for='item in aIntervalOptions'>
                <input type='radio' :id='item.intervalText' class='radioButton' name='intervalSelect' :value='item.intervalValue' @click='onSetIntervalValue' :checked='item.checked'>
                <label :for=item.intervalText>
                    {{ item.intervalText }}
                </label><br>
            </li>
        </ul>
        <button class='btn' @click='onConfirmSettings'>
            Übernehmen
        </button>
    </div>
</template>