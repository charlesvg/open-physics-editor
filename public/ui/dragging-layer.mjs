export class DraggingLayer {
    constructor(stage, forLayer) {


        // Enable dragging on 'empty space'
        const draggingLayer = new Konva.Layer({draggable: true});

        stage.add(draggingLayer);
        draggingLayer.zIndex(forLayer.zIndex()-1);


        draggingLayer.on('mouseenter', function () {
            stage.container().style.cursor = 'pointer';
        });

        draggingLayer.on('mouseleave', function () {
            stage.container().style.cursor = 'default';
        });


        const draggingRect = new Konva.Rect({
            width: stage.width(),
            height: stage.height()
        })
        draggingLayer.add(draggingRect);

        // move rectangle so it always stay on the screen
        draggingLayer.on('dragstart', () => {
            forLayer.startDrag();
        });
        draggingLayer.on('dragend', function () {
            draggingRect.setAbsolutePosition({x: 0, y: 0});
            draggingLayer.draw();
            // forLayer.stopDrag();
        });

        window.addEventListener('ops.resize', (event) => {
            draggingRect.width(event.detail.width);
            draggingRect.height(event.detail.height);
        });
    }
}