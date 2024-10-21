import * as opencv from "../polygon-detection/opencv.mjs";
import {Contour} from "./contour.mjs";
import {cbk, getComponent, rdr} from "./framework/components.mjs";

export class ContourManager {
    #contours = [];

    clearContours() {
        for (let contour of this.#contours) {
            contour.hide();
        }
    }

    async drawContours(stage, layer, size) {
        let rawContours = await opencv.getVertices(layer.getNativeCanvasElement());
        this.#contours = [];
        for (let rawContour of rawContours) {
            this.#contours.push(new Contour(stage, layer, rawContour, size));
            // contour.print();
        }
        await this.#addContoursToMenu();
    }

    #numberToOrdinalWord(n) {
        const special = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
        const deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

        if (n < 20) return special[n];
        if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth';
        return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10];
    }

    #capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async #addContoursToMenu() {
        let html = '';
        $('#contoursContainer').empty();
        for (let i = 0; i < this.#contours.length; i++) {
            let name = this.#capitalizeFirstLetter(this.#numberToOrdinalWord(i + 1));
            await rdr({
                filename:'./assets/contours-checkbox.component.html',
                selector: '#contoursContainer',
                state: {
                    checkboxId:'checkbox-' + i,
                    copyButtonId: 'copyButton-' + i,
                    anchorId: 'anchor-checkbox-' + i,
                    name: name
                }
            });
            $('#checkbox-'+ i).on('click', (e) => {
                this.#contours[i].toggleVisibility();
            });

            $('#copyButton-'+ i).on('click', (e) => {
                const contour = this.#contours[i];
                const output = contour.print();

                try {
                    navigator.clipboard.writeText(output);
                } catch (error) {
                    console.error(error.message);
                }
            });



            // cbk('#anchor-checkbox-' + i,'click', e => {
            //     console.log('checkbox clicked', i);
            //     this.#contours[i].toggleVisibility();
            // })
        }
    }
}