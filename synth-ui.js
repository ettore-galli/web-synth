'use strict'


class SynthUIStateManager {
    constructor() {

        this.state = {
            control: {
                volume: 0.1,
                filterFrequency: 1000,
                filterQ: 3,
            },
            note: {
                noteFrequency: 0,
                volume: 0,
                filterFrequency: 0,
                filterQ: 0,
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

        this.setControlVolume = (value) => {
            this.updateState("control", { ...this.state.control, volume: value });
        }
        this.setControlFilterFrequency = (value) => {
            this.updateState("control", { ...this.state.control, filterFrequency: value });
        }
        this.setControlFilterQ = (value) => {
            this.updateState("control", { ...this.state.control, filterQ: value });
        }

        this.playNote = (noteFrequency, volume) => {
            this.updateState("note", {
                ...this.state.note,
                noteFrequency: noteFrequency,
                volume: volume,
                filterQ: this.state.control.filterQ,
            });
        }

        this.playNoteAtControlVolume = (noteFrequency) => {
            this.playNote(noteFrequency, this.state.control.volume);
        }

        this.releaseNote = () => {
            this.updateState("note", {
                ...this.state.note,
                volume: 0.0
            });
        }

        this.setNoteFilterFrequency = (filterFrequency) => {
            this.updateState("note", {
                ...this.state.note,
                filterFrequency: filterFrequency
            });
        }

        this.getControlVolume = () => this.getState().control.volume;
        this.getControlFilterFrequency = () => this.getState().control.filterFrequency;
        this.getControlFilterQ = () => this.getState().control.filterQ;

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


function buildPadKeyboard(synth, synthState, numberOfKeys, keyAreaId) {
    for (let i = 0; i < numberOfKeys; i++) {

        const keyNumber = i + 1;
        const key = document.getElementById("key-template").content.cloneNode(true).children[0];

        key.id = getKeyIdFromNumber(keyNumber);
        key.style.width = String(95.0 / numberOfKeys) + "%";
        document.getElementById(keyAreaId).appendChild(key);


        key.onmouseover = function (e) {
            const noteFrequency = 220 * Math.pow(2, keyNumber / 12)
            synthState.playNoteAtControlVolume(noteFrequency)
        }

        key.onmousemove = function (e) {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; // x position within the element.
            var y = e.clientY - rect.top;  // y position within the element.
            var filterFrequency = getControllerVaue(y, rect.height, synthState.getControlFilterFrequency(), true)
            synthState.setNoteFilterFrequency(filterFrequency);
        }

        key.onmouseleave = function (e) {
            synthState.releaseNote();
        }

    }
}

function sendStateToSynth(state, synth) {
    synth.setFilterFrequency(state.note.filterFrequency);
    synth.setFilterQ(state.note.filterQ);
    synth.playNote(state.note.noteFrequency, state.note.volume);
}

function sendStateToUI(state, volumeController, filterFrequency, filterQ) {
    document.getElementById("debug").innerHTML = JSON.stringify(state);

    volumeController.value = state.control.volume;
    filterFrequency.value = state.control.filterFrequency;
    filterQ.value = state.control.filterQ;
}

function initSynth(window, document) {
    const synth = new WebSynth(window);
    const synthUIStateManager = new SynthUIStateManager();

    const volumeController = document.getElementById('volume');
    const filterFrequency = document.getElementById('filter-frequency');
    const filterQ = document.getElementById('filter-q');

    sendStateToUI(synthUIStateManager.getState(), volumeController, filterFrequency, filterQ)

    synthUIStateManager.addUppdateSubscriber(
        (state) => {
            sendStateToSynth(state, synth);
            sendStateToUI(state, volumeController, filterFrequency, filterQ);
        }
    );

    volumeController.addEventListener('input', function () {
        synthUIStateManager.setControlVolume(this.value);
    }
    );

    filterFrequency.addEventListener('input', function () {
        synthUIStateManager.setControlFilterFrequency(this.value);
    }
    );

    filterQ.addEventListener('input', function () {
        synthUIStateManager.setControlFilterQ(this.value);
    }
    );

    const numberOfKeys = synth.noteMap.length;

    buildPadKeyboard(synth, synthUIStateManager, numberOfKeys, "key-area-up");
    buildPadKeyboard(synth, synthUIStateManager, numberOfKeys, "key-area-down");

    window.ettore = synthUIStateManager; // DEBUG-ONLY
}
