'use strict';

class WebSynth {

    constructor(
        window
    ) {
        console.log("AudioPage init init...")
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        this.audioContext = new AudioContext();

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

        this.isFromOrToZeroTransition = (v1, v2) => {
            return (v1 === 0.0 && v2 !== 0.0) || (v1 != 0.0 && v2 === 0.0);
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
            this.resumeIfSuspended();
            if (this.isFromOrToZeroTransition(this.gainNode.gain.value, volume)) {
                console.log("play note ", this.gainNode.gain.value, volume)
                this.startNote(frequency, parseFloat(volume), 0.1);
            }
        }

        console.log("AudioPage init completed.")

    }

}

