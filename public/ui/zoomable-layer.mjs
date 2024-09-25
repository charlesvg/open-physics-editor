export class ZoomableLayer {
    #stage;
    constructor(stage, layer) {
        this.#stage = stage;
        this.doZoom(layer);
    }
    doZoom (layer)  {

        const scaleBy = 1.2;
        this.#stage.on('wheel', (e) => {


            // stop default scrolling
            e.evt.preventDefault();

            let oldScale = layer.scaleX();
            let pointer = this.#stage.getPointerPosition();

            let mousePointTo = {
                x: (pointer.x - layer.x()) / oldScale,
                y: (pointer.y - layer.y()) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?
            let direction = e.evt.deltaY > 0 ? -1 : 1;

            // when we zoom on trackpad, e.evt.ctrlKey is true
            // in that case lets revert direction
            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            layer.scale({x: newScale, y: newScale});

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            layer.position(newPos);


        });
    }
}