import * as opencv from "../polygon-detection/opencv.mjs";
import {Contour} from "./contour.mjs";
import {getComponent} from "./framework/components.mjs";

export class ContourManager {
    #contours = [];

    async drawContours(stage, layer) {
        let rawContours = await opencv.getVertices(layer.getNativeCanvasElement());
        this.#contours = [];
        for (let rawContour of rawContours) {
            this.#contours.push(new Contour(stage, layer, rawContour));
        }
        this.#addContoursToMenu();
    }

    #numberToOrdinalWord(n) {
        const special = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
        const deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

        if (n < 20) return special[n];
        if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth';
        return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10];
    }

    async #addContoursToMenu() {
        let html = '';
        for (let i = 0; i < this.#contours.length; i++) {
            html += await getComponent('./assets/contours-checkbox.component.html',
                {
                    id: 'checkbox-' + i,
                    name: this.#numberToOrdinalWord(i + 1)
                });
        }
        document.getElementById('contoursContainer').insertAdjacentHTML('beforeend', html);
    }
}