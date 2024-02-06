<script>
     import { ref } from 'vue'

    export default {       
        el: '#settingsDialog',
        name: 'SettingsDialog',        
        data: () => ({ 
            isShowSettings: false,
            aSettingsOptions: ref ([
                { 
                    trackingInterval: '5 Sek.',
                    value: 5000,
                    checked: false,
                }, 
                { 
                    trackingInterval: '10 Sek.',
                    value: 10000,
                    checked: false,
                }, 
                { 
                    trackingInterval: '20 Sek.',
                    value: 20000,
                    checked: false,
                },
                { 
                    trackingInterval: '30 Sek.',
                    value: 30000,
                    checked: false,
                },
                { 
                    trackingInterval: '40 Sek.',
                    value: 40000,
                    checked: false,
                },
                { 
                    trackingInterval: '50 Sek.',
                    value: 50000,
                    checked: false,
                },
                { 
                    trackingInterval: '60 Sek.',
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

            onSetIntervalValue( event ) {
                this.oSelectedInterval = {
                    'text': event.target.id,
                    'value': event.target.value                    
                }
            },

            onConfirmSettings() {

                const storedInterval = JSON.parse( window.localStorage.getItem( 'SelectedTrackingInterval' ) );

                // If this.oSelectedInterval === undefined Then the user has not made a new selection.
                if ( this.oSelectedInterval !== undefined && this.oSelectedInterval.value !== storedInterval ) {
                    console.log( 'Selected Tracking Interval', this.oSelectedInterval.value );

                    // Use only two first digits of interval value for seconds counter
                    // Before check if value has more then 4 digits. If true then keep 2 digits else keep 1 one digit (e.g 5sec)
                    let sIntervalValue = this.oSelectedInterval.value.toString().length;

                    if ( sIntervalValue > 4 ) {
                        this.oSelectedInterval.valueInSec = this.oSelectedInterval.value.substring( 0, 2 );
                    } else {
                        this.oSelectedInterval.valueInSec = this.oSelectedInterval.value.substring( 0, 1 );
                    }   

                    window.localStorage.setItem( 'SelectedTrackingInterval', JSON.stringify( this.oSelectedInterval ) );
                    this.isShowSettings = !this.isShowSettings;
                    this.emitter.emit( 'close-settings' );

                    if ( this.activeTracking === true ) {
                        this.emitter.emit( 'restart-tracking' );
                    }

                } else {

                    this.isShowSettings = !this.isShowSettings;
                    this.emitter.emit( 'close-settings' );

                }
            }
        },
        created() {
            
        },
        beforeMount() {
            
        },
        mounted() { 

            setCheckedRadioButton.call( this );

            // Check if there's a stored tracking interval. If exists, set checked radio button.
            function setCheckedRadioButton() {

                let storedInterval = JSON.parse( window.localStorage.getItem( 'SelectedTrackingInterval' ) );

                if ( storedInterval !== null ) {

                    let storedIntervalValue = Number( storedInterval.value );

                    if ( storedInterval !== null ) {

                        this.aSettingsOptions.forEach(function( oItem ) {
                            if ( storedIntervalValue === oItem.value ) {
                                oItem.checked = 'checked';
                            }                        
                        })
                    }    
                }            
            }

            // Open settings dialog. (Triggered by Header.vue)
            this.emitter.on( 'open-settings', ( bActiveTracking ) => {    
                this.isShowSettings = !this.isShowSettings;
                // Get boolean from Header.vue to check if tracking is active
                this.activeTracking = bActiveTracking;
                console.log( 'Active tracking in settings', this.activeTracking );
            });           
        }
    }
</script>

<template>
    <div class='app__main-container--settingsDialog' v-bind:class='{ showSettingsDialog: isShowSettings }' id='settingsDialog'>
        <h2>Einstellungen</h2>
        <span class='app__main-container--settingsDialog-List-Title'>Tracking Intervall</span>
        <ul class='app__main-container--settingsDialog-List'>
            <li v-for='item in aSettingsOptions'>
                <input type='radio' :id='item.trackingInterval' class='radioButton' name='intervalSelect' :value='item.value' @click='onSetIntervalValue' :checked='item.checked'>
                <label for=''>{{ item.trackingInterval }}</label><br>
            </li>
        </ul>
        <button class='btn' @click='onConfirmSettings'>
            Übernehmen
        </button>
    </div>
</template>