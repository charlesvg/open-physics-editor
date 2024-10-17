import {ContourManager} from "./contour-manager.mjs";
import {registerImportFile} from "./import.mjs";

export class EditorImage {
    #stage;
    layer;
    #contourManager;
    #image;
    constructor(stage) {
        this.#stage = stage;
        this.layer = new Konva.Layer();
        this.#contourManager = new ContourManager();

        stage.add(this.layer);
        this.load('./assets/turret-shoot-fire.png');
        registerImportFile(this.load.bind(this));

    }

    async load(url) {
        this.layer.position({
            x: 0,
            y: 0
        });
        this.layer.scale({ x: 1, y: 1 });
        let loadImage = (url) => {
            let imageObj = new Image();
            imageObj.src = url;
            return new Promise((resolve, reject) => {
                imageObj.onload = () => {
                    resolve(imageObj);
                }
            })
        }
        let imageObj = await loadImage(url);
        if (this.#image) {
            this.#image.remove();
            this.#contourManager.clearContours();
            this.layer.draw();
        }
        this.#image = new Konva.Image({
            x: 50,
            y: 50,
            image: imageObj,
            width: 300,
            height: 300,
        });

        this.layer.add(this.#image);
        this.layer.draw();
        await this.drawContours();

    }

    async drawContours() {
        await this.#contourManager.drawContours(this.#stage, this.layer);
    }
}