'use strict'


class SynthUIState {
    constructor() {

        this.state = {
            masterVolume: 0,
            filterFrequency: 0,
            filterQ: 0,
            note: {
                synthNoteNumber : 0, 
                noteVolume: 0
            }
        };

        this.updateSubscribers = [];

        this.addUppdateSubscriber = function (subscriber) {
            this.updateSubscribers.push(subscriber);
        }

        this.getState = () => {
            return { ...this.state };
        }

        this.updateState = function (key, value) {
            this.state = {
                ...this.state,
                [key]: value
            };
            this.updateSubscribers.forEach(subscriber => subscriber(this.getState()));
        }

        this.setNote = (id, note)=>{
            this.state = {
                ...this.state,
                note
            }    
        }

        this.playNoteNumber = (synthNoteNumber, noteVolume) => {
            this.setNote({synthNoteNumber, noteVolume});
        }

        this.setNoteVolume = (noteVolume) => {
            this.setNote({...this.note, noteVolume});
        }

        this.releaseNote = () => {
            this.this.setNoteVolume(0);
        }

        this.getMasterVolume = () => this.getState().masterVolume;
        this.getFilterFrequency = () => this.getState().filterFrequency;
        this.getFilterQ = () => this.getState().filterQ;
    }

}

function getKeyIdFromNumber(keyNumber) {
    return "area" + String(keyNumber);
}

function getKeyFromNumber(keyNumber) {
    return document.getElementById(getKeyIdFromNumber(keyNumber))
}

function getControllerVaue(controllerValue, controllerMaxValue, dimensionalValue, reverse) {
    if (reverse) {
        return dimensionalValue * (controllerMaxValue - controllerValue) / controllerMaxValue;
    } else {
        return dimensionalValue * controllerValue / controllerMaxValue;
    }

}

// function buildPadKey(synth, synthState, numberOfKeys, keyAreaId) {
//     for (let i = 0; i < numberOfKeys; i++) {

//         const keyNumber = i + 1;
//         const key = document.getElementById("key-template").content.cloneNode(true).children[0];

//         key.id = getKeyIdFromNumber(keyNumber);
//         key.style.width = String(95.0 / numberOfKeys) + "%";
//         document.getElementById(keyAreaId).appendChild(key);


//         key.onmouseover = function (e) {
//             synth.playNoteNumber(keyNumber, synthState.getMasterVolume());
//         }

//         key.onmousemove = function (e) {
//             var rect = e.target.getBoundingClientRect();
//             var x = e.clientX - rect.left; // x position within the element.
//             var y = e.clientY - rect.top;  // y position within the element.
//             var filterFrequency = (y / rect.height) * synthState.getFilterFrequency();
//             var filterFrequency = getControllerVaue(y, rect.height, synthState.getFilterFrequency(), true)
//             synth.setFilterFrequency(filterFrequency);
//         }

//         key.onmouseleave = function (e) {
//             synth.releaseNote();
//         }

//     }
// }

function buildPadKeyboard(synth, synthState, numberOfKeys, keyAreaId) {
    for (let i = 0; i < numberOfKeys; i++) {

        const keyNumber = i + 1;
        const key = document.getElementById("key-template").content.cloneNode(true).children[0];

        key.id = getKeyIdFromNumber(keyNumber);
        key.style.width = String(95.0 / numberOfKeys) + "%";
        document.getElementById(keyAreaId).appendChild(key);


        key.onmouseover = function (e) {
            // synth.playNoteNumber(keyNumber, synthState.getMasterVolume());
            synthUIState.playNoteNumber(keyNumber, synthState.getMasterVolume());
        }

        key.onmousemove = function (e) {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; // x position within the element.
            var y = e.clientY - rect.top;  // y position within the element.
            var filterFrequency = (y / rect.height) * synthState.getFilterFrequency();
            var filterFrequency = getControllerVaue(y, rect.height, synthState.getFilterFrequency(), true)
            synth.setFilterFrequency(filterFrequency);
        }

        key.onmouseleave = function (e) {
            // synth.releaseNote();
            synthUIState.playNoteNumber(0, 0);
        }

    }
}

function initSynth(window, document) {
    const synth = new WebSynth(window);
    const synthUIState = new SynthUIState();

    const volumeController = document.getElementById('volume');
    const filterFrequency = document.getElementById('filter-frequency');
    const filterQ = document.getElementById('filter-q');

    synthUIState.addUppdateSubscriber(
        (state) => {
            //console.log(state);
            synth.setVolume(state.masterVolume);
            synth.setFilterFrequency(state.filterFrequency);
            synth.setFilterQ(state.filterQ);
            synth.playNoteNumber(state.note.synthNoteNumber, state.note.noteVolume);
        }
    );

    volumeController.addEventListener('input', function () {
        synthUIState.updateState("masterVolume", this.value);
    }
    );

    filterFrequency.addEventListener('input', function () {
        synthUIState.updateState("filterFrequency", this.value);
    }
    );

    filterQ.addEventListener('input', function () {
        synthUIState.updateState("filterQ", this.value);
    }
    );

    const numberOfKeys = synth.noteMap.length;

    buildPadKeyboard(synth, synthUIState, numberOfKeys, "key-area-up");
    buildPadKeyboard(synth, synthUIState, numberOfKeys, "key-area-down");

    window.ettore = synthUIState; // DEBUG-ONLY
}
