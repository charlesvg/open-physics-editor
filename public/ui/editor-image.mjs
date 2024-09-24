import {drawContours} from "./contour.mjs";

export class EditorImage {
    #stage;
    layer;
    constructor(stage) {
        this.#stage = stage;
        this.layer = new Konva.Layer();

        stage.add(this.layer);
    }

    async load() {
        let loadImage = (url) => {
            let imageObj = new Image();
            imageObj.src = url;
            return new Promise((resolve, reject) => {
                imageObj.onload = () => {
                    resolve(imageObj);
                }
            })
        }
        let imageObj = await loadImage('./assets/turret-shoot-fire.png');
        const image = new Konva.Image({
            x: 50,
            y: 50,
            image: imageObj,
            width: 300,
            height: 300,
        });

        this.layer.add(image);
    }

    async drawContours() {
        await drawContours(this.#stage, this.layer);
    }
}