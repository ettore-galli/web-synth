'use strict';

class WebSynth {

    constructor(
        window
    ) {
        console.log("AudioPage init init...")
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.audioContext = new AudioContext();

        this.oscillatorNoteOn = false;
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = "square";

        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 0;
        this.filter.Q.value = 0;

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0;

        this.oscillator
            .connect(this.filter)
            .connect(this.gainNode)
            .connect(this.audioContext.destination);
        this.oscillator.start(0);

        this.resumeIfSuspended = () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }

        this.setFrequency = (value) => {
            this.resumeIfSuspended();
            this.oscillator.frequency.value = value;
        }

        this.setVolume = (value) => {
            this.resumeIfSuspended();
            this.gainNode.gain.value = value;
        }

        this.setVolumeWithAttackTime = (volumeValue, attackTime) => {
            this.resumeIfSuspended();

            this.gainNode.gain.linearRampToValueAtTime(
                volumeValue,
                this.audioContext.currentTime + attackTime
            );
        }

        this.setFilterFrequency = (value) => {
            this.resumeIfSuspended();
            this.filter.frequency.value = value;
        }

        this.setFilterQ = (value) => {
            this.resumeIfSuspended();
            this.filter.Q.value = value;
        }

        this.startNote = (frequency, volume, attackTime) => {
            this.setFrequency(frequency);
            this.setVolumeWithAttackTime(volume, attackTime);
        }

        this.playNote = (frequency, volume) => {
            const oscillatorNoteOn = Boolean(frequency !== 0.0);
            if (this.oscillatorNoteOn != oscillatorNoteOn) {
                console.log("playnote", this.oscillator.frequency.value, frequency, volume)
                this.resumeIfSuspended();
                this.startNote(frequency, parseFloat(volume), 0.1);
                this.oscillatorNoteOn = oscillatorNoteOn;
            }
        }

        console.log("AudioPage init completed.")

    }

}

