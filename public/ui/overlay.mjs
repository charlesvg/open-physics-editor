import {ResponsivePixelRatioBehavior} from "./responsive-pixel-ratio.behavior.mjs";

export class Overlay {
    #layer;
    #text;
    constructor(stage) {
        this.#layer = new Konva.Layer();
        this.#text = new Konva.Text({
            x: 10,
            y: 10,
            fontFamily: 'Calibri',
            fontSize: 24,
            text: '',
            fill: 'white',
        });



        this.#layer.add(this.#text);

        new ResponsivePixelRatioBehavior(this.#layer);

        stage.add(this.#layer);
    }
    writeMessage(message) {
        this.#text.text(message);
    }
}