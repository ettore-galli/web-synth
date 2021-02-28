'use strict'
import WebSynthCore from "./synth-core";

export default class WebSynthControl {
    constructor(window) {
        this.synth = new WebSynthCore(window);
        this.state = {
            control: {
                volume: 0.03,
                filterFrequency: 3000,
                filterQ: 5,
                oscillatorType: "sawtooth"
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
        this.setControlOscillatorType = (value) => {
            this.updateState("control", { ...this.state.control, oscillatorType: value });
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
                noteFrequency: 0.0,
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

        this.sendStateToSynth = (state, synth) => {
            synth.setFilterFrequency(state.note.filterFrequency);
            synth.setFilterQ(state.note.filterQ);
            synth.setOscillatorType(state.control.oscillatorType);
            synth.playNote(state.note.noteFrequency, state.note.volume);
        }

        this.addUppdateSubscriber(
            (state) => {
                this.sendStateToSynth(state, this.synth);
            }
        );
    }

}

 

