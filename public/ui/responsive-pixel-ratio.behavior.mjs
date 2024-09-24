// This fixes konva shapes becoming blurry after a zoom
export class ResponsivePixelRatioBehavior {
    constructor(layer) {
        // This fixes konva shapes becoming blurry after a zoom
        window.addEventListener('resize', function () {
            Konva.pixelRatio = window.devicePixelRatio;
            // update pixel ratio of existing canvas
            layer.canvas.setPixelRatio(Konva.pixelRatio);
            layer.draw();
        });
    }
}