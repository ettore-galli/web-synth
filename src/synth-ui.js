import WebSynthControl from "./synth-control";
import Scales from "./synth-scales";

'use strict'

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

function buildPadKeyboard(noteMap, synthState, numberOfKeys, keyAreaId) {
    for (let i = 0; i < numberOfKeys; i++) {

        const keyNumber = i + 1;
        const key = document.getElementById("key-template").content.cloneNode(true).children[0];

        key.id = getKeyIdFromNumber(keyNumber);
        key.style.width = String(95.0 / numberOfKeys) + "%";
        document.getElementById(keyAreaId).appendChild(key);


        key.onmouseover = function (e) {
            const noteFrequency = noteMap[keyNumber];

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


function sendStateToUI(state, volumeController, filterFrequency, filterQ, oscillatorType) {
    document.getElementById("debug").innerHTML = JSON.stringify(state);

    volumeController.value = state.control.volume;
    filterFrequency.value = state.control.filterFrequency;
    filterQ.value = state.control.filterQ;
    oscillatorType.value = state.control.oscillatorType;
}

export default function initSynth(window, document) {
    const synthUIStateManager = new WebSynthControl(window);
    const scales = new Scales();
    const volumeController = document.getElementById('volume');
    const filterFrequency = document.getElementById('filter-frequency');
    const filterQ = document.getElementById('filter-q');
    const oscillatorType = document.getElementById('oscillator-type');

    sendStateToUI(synthUIStateManager.getState(), volumeController, filterFrequency, filterQ, oscillatorType)

    synthUIStateManager.addUppdateSubscriber(
        (state) => {
            sendStateToUI(state, volumeController, filterFrequency, filterQ, oscillatorType);
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

    oscillatorType.addEventListener('input', function () {
        synthUIStateManager.setControlOscillatorType(this.value);
    }
    );
    const noteMap = scales.pentathonicNoteMap;
    const numberOfKeys = noteMap.length;

    buildPadKeyboard(noteMap, synthUIStateManager, numberOfKeys, "key-area-up");
    buildPadKeyboard(noteMap, synthUIStateManager, numberOfKeys, "key-area-down");

    window.ettore = synthUIStateManager; // DEBUG-ONLY
}