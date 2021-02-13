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
        this.filter.Q.value = 4;

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 0;

        this.oscillator
            .connect(this.filter)
            .connect(this.gainNode)
            .connect(this.audioContext.destination);
        this.oscillator.start(0);

        const thisClassContext = this;

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
            this.resumeIfSuspended();
            this.startNote(frequency, parseFloat(volume), 0.1);
        }

        this.chromaticNoteMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(
            (n) => 220 * Math.pow(2, n / 12)
        );

        this.pentathonicNoteMap = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26].map(
            (n) => 220 * Math.pow(2, n / 12)
        );

        this.noteMap = this.pentathonicNoteMap;

        this.playNoteNumber = (n, volume) => {
            const frequency = n > 0 ? this.noteMap[n - 1] : 0;
            this.playNote(frequency, parseFloat(volume));
        }

        console.log("AudioPage init completed.")

    }

}

