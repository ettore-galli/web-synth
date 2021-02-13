'use strict'


class SynthUIState {
    constructor() {

        this.state = {
            volume: 0,
            filterFrequency: 0,
            filterQ: 0
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


        this.getVolume = () => this.getState().volume;
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
    if (reverse){
        return dimensionalValue * (controllerMaxValue - controllerValue) / controllerMaxValue;
    } else {
        return dimensionalValue * controllerValue / controllerMaxValue;
    }
    
}

function buildPadKey(synth, synthState, numberOfKeys, keyAreaId) {
    for (let i = 0; i < numberOfKeys; i++) {

        const keyNumber = i + 1;
        const key = document.getElementById("key-template").content.cloneNode(true).children[0];

        key.id = getKeyIdFromNumber(keyNumber);
        key.style.width = String(95.0 / numberOfKeys) + "%";
        document.getElementById(keyAreaId).appendChild(key);


        key.onmouseover = function (e) {
            synth.playNoteNumber(keyNumber, synthState.getVolume());
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
            synth.releaseNote();
        }

    }
}

function buildPadKeyboard(synth, synthState, numberOfKeys, keyAreaId) {
    for (let i = 0; i < numberOfKeys; i++) {

        const keyNumber = i + 1;
        const key = document.getElementById("key-template").content.cloneNode(true).children[0];

        key.id = getKeyIdFromNumber(keyNumber);
        key.style.width = String(95.0 / numberOfKeys) + "%";
        document.getElementById(keyAreaId).appendChild(key);


        key.onmouseover = function (e) {
            synth.playNoteNumber(keyNumber, synthState.getVolume());
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
            synth.releaseNote();
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
            synth.setVolume(state.volume);
        }
    );

    synthUIState.addUppdateSubscriber(
        (state) => {
            synth.setFilterFrequency(state.filterFrequency);
        }
    );

    synthUIState.addUppdateSubscriber(
        (state) => {
            synth.setFilterQ(state.filterQ);
        }
    );

    volumeController.addEventListener('input', function () {
        synthUIState.updateState("volume", this.value);
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
