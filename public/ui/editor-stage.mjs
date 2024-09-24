import {Overlay} from "./overlay.mjs";
import {EditorImage} from "./editor-image.mjs";
import {DraggingLayer} from "./dragging-layer.mjs";
import {Zoom} from "./zoom.mjs";
import {ResponsiveStage} from "./responsive-stage.mjs";

export class EditorStage {
    stage;
    image;
    overlay;
    drag;
    constructor(stage) {
        this.stage = stage;
        this.overlay = new Overlay(stage);
        this.image = new EditorImage(stage);
        this.image.load();
        this.drag = new DraggingLayer(stage, this.image.layer);

        stage.on('pointermove',  () => {
            const pointerPos = stage.getPointerPosition();
            const x = Math.round(pointerPos.x);
            const y = Math.round(pointerPos.y);
            let relativeX = Math.round(x - this.image.layer.x());
            let relativeY = Math.round(y - this.image.layer.y());
            let scale = this.image.layer.getAbsoluteScale();
            let calculatedX = Math.round(relativeX / scale.x);
            let calculatedY = Math.round(relativeY / scale.y);
            this.overlay.writeMessage('x: ' + calculatedX + ', y: ' + calculatedY);
        });

        stage.on('pointerdown', function () {
            // addCircle();
        });

        new Zoom(this.stage, this.image.layer);
        // new ResponsiveStage(this.stage);
    }

}
