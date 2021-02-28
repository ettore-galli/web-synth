'use strict';

export default class Scales {
    constructor(a, octave) {
        console.log("Building scales...")
        
        this.A=a;
        this.octave=octave;

        this.chromaticMap = Array.from(Array(24).keys()).map(
            (n) => a * Math.pow(2, octave) * Math.pow(2, n / 12)
        );

        this.scales = {
            chromatic: this.chromaticMap
        }

        this.chromaticNoteMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(
            (n) => 220 * Math.pow(2, n / 12)
        );

        this.pentathonicNoteMap = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26].map(
            (n) => 220 * Math.pow(2, n / 12)
        );

        console.log("Building scales done")

    }

}

