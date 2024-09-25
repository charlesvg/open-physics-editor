import * as opencv from "../polygon-detection/opencv.mjs";
import {Contour} from "./contour.mjs";

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

    #addContoursToMenu() {
        for (let i = 0; i < this.#contours.length; i++) {
            document.getElementById('contoursContainer').insertAdjacentHTML('beforeend',
                `
                        <a class="dropdown-item w-100" href="#">
                            <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                ${this.#numberToOrdinalWord(i+1)}
                            </label>
                        </div></a>
                    `);
        }


    }
}