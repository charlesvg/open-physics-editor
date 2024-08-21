import * as opencv from "../polygon-detection/opencv.mjs";

var stage = new Konva.Stage({
    container: 'kontainer',   // id of container <div>
    width: 500,
    height: 500
});

const imageLayer = new Konva.Layer({draggable: true});
const overlayLayer = new Konva.Layer();
// Enable dragging on 'empty space'
const draggingLayer = new Konva.Layer({draggable: true});
stage.add(draggingLayer);


draggingLayer.on("mouseenter", function () {
    stage.container().style.cursor = 'pointer';
});

draggingLayer.on("mouseleave", function () {
    stage.container().style.cursor = 'default';
});


const draggingRect = new Konva.Rect({
    width: stage.width(),
    height: stage.height()
})
draggingLayer.add(draggingRect);

// move rectangle so it always stay on the screen, no matter where layer it
draggingLayer.on('dragstart', () => {
    imageLayer.startDrag();
});
draggingLayer.on('dragend', function () {
    draggingRect.setAbsolutePosition({x: 0, y: 0});
    draggingLayer.draw();
    // imageLayer.stopDrag();
});


stage.add(imageLayer);
stage.add(overlayLayer);

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
var image = new Konva.Image({
    x: 50,
    y: 50,
    image: imageObj,
    width: 300,
    height: 300,
});

imageLayer.add(image);


// var layer = new Konva.Layer();

var text = new Konva.Text({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'white',
});

function writeMessage(message) {
    text.text(message);
}

stage.on('pointermove', function () {
    const pointerPos = stage.getPointerPosition();
    const x = Math.round(pointerPos.x);
    const y = Math.round(pointerPos.y);
    let relativeX = Math.round(x - imageLayer.x());
    let relativeY = Math.round(y - imageLayer.y());
    let scale = imageLayer.getAbsoluteScale();
    let calculatedX = Math.round(relativeX / scale.x);
    let calculatedY = Math.round(relativeY / scale.y);
    writeMessage('x: ' + calculatedX + ', y: ' + calculatedY);
});

stage.on('pointerdown', function () {
    // addCircle();
});

class ContourPoint {
    circle;
    frontLine;
    backLine;


    constructor(circle, frontLine, backLine) {
        this.circle = circle;
        this.frontLine = frontLine;
        this.backLine = backLine;
        // if (backLine) imageLayer.add(backLine);
        // if (frontLine) imageLayer.add(frontLine);
        // imageLayer.add(circle);
        // imageLayer.draw();
    }
}


class Contour {
    #points = [];

    constructor(vertices) {
        this.#generateContourPointsFromVertices(vertices);
        this.#drawPoints();
        this.#drawMenu(vertices);
    }
    #drawMenu(vertices) {
        let bounds = polygonBounds(vertices);
        const menuRect = new Konva.Rect({
            x: bounds.x1,
            y: bounds.y1 - 30,
            width: bounds.x2 - bounds.x1,
            height: 20,
            fill:'rgba(255,0,0,0.4)'
        });
        imageLayer.add(menuRect);

    }

    #drawPoints() {
        for (let point of this.#points) {
            imageLayer.add(point.backLine);
        }
        for (let point of this.#points) {
            imageLayer.add(point.frontLine);
        }
        for (let point of this.#points) {
            imageLayer.add(point.circle);
        }
        imageLayer.draw();
    }

    #generateContourPointsFromVertices(vertices) {
        let color = getRandomColor();
        let lastVertex = vertices[vertices.length - 1];
        for (let vertex of vertices) {
            this.addPoint(lastVertex, vertex);
            lastVertex = vertex;
        }
    }

    addPoint(lastVertex, newVertex) {
        let circle = this.#addCircle(newVertex);
        let frontLine = this.#addFrontLine(lastVertex, newVertex);
        let backLine = this.#addBackLine(lastVertex, newVertex);
        let newPoint = new ContourPoint(circle, frontLine, backLine);
        this.#points.push(newPoint);

        circle.on('mouseover', function () {
            document.body.style.cursor = 'move';
            this.stroke('yellow');
        });
        circle.on('mouseout', function () {
            document.body.style.cursor = 'default';
            this.stroke('black');
        });

        circle.on('dragmove', () => {
            this.#onDragMove(newPoint);
        });
    }

    #onDragMove(contourPoint) {
        const pointerPos = stage.getPointerPosition();
        const x = Math.round(pointerPos.x);
        const y = Math.round(pointerPos.y);

        let involvedContourPoint;
        if (this.#points[this.#points.length - 1] === contourPoint) {
            // We're moving the last contourPoint
            involvedContourPoint = this.#points[0];
        } else {
            let elementIndex = this.#points.findIndex((element) => element === contourPoint);
            involvedContourPoint = this.#points[elementIndex + 1];
        }

        const p1 = contourPoint.frontLine.points();
        const newPoints1 = [p1[0], p1[1], contourPoint.circle.x(), contourPoint.circle.y()];
        contourPoint.frontLine.points(newPoints1);
        contourPoint.backLine.points(newPoints1);

        const p2 = involvedContourPoint.frontLine.points();
        const newPoints2 = [contourPoint.circle.x(), contourPoint.circle.y(), p2[2], p2[3],];
        involvedContourPoint.frontLine.points(newPoints2);
        involvedContourPoint.backLine.points(newPoints2);


        console.log(contourPoint);
    }

    #addCircle(point) {
        return new Konva.Circle({
            x: point.x,
            y: point.y,
            radius: 3,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 2,
            draggable: true
        });
    }

    #addBackLine(fromVertex, toVertex) {
        return new Konva.Line({
            points: [fromVertex.x, fromVertex.y, toVertex.x, toVertex.y],
            stroke: 'black',
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
        });
    }

    #addFrontLine(fromVertex, toVertex) {
        const frontLine = new Konva.Line({
            points: [fromVertex.x, fromVertex.y, toVertex.x, toVertex.y],
            stroke: 'white',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });

        frontLine.on('mousedown', () => {
            frontLine.stroke('yellow');
        });
        frontLine.on('mouseup', () => {
            frontLine.stroke('white');
        });

        // stage.container().addEventListener('keydown', function (e) {
        //     const KEYCODE_DELETE = 46;
        //     if (e.keyCode === KEYCODE_DELETE) {
        //
        //     }
        //     e.preventDefault();
        // });

        return frontLine;
    }
}

export function polygonBounds(polygon){
    let xMin = Infinity,
        xMax = -Infinity,
        yMin = Infinity,
        yMax = -Infinity;

    for (let i = 0, l = polygon.length; i < l; i++){
        const p = polygon[i],
                x = p.x,
            y = p.y;

        if (x !== undefined && isFinite(x) && y !== undefined && isFinite(y)){
            if (x < xMin) xMin = x;
            if (x > xMax) xMax = x;
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }
    }

    return {x1:xMin, y1:yMin, x2: xMax, y2: yMax};
}

let rawContours = await opencv.getVertices(imageLayer.getNativeCanvasElement());
let contours = [];
for (let rawContour of rawContours) {
    new Contour(rawContour);
}


overlayLayer.add(text);

imageLayer.draw();
overlayLayer.draw();


// This fixes konva shapes becoming blurry after a zoom
window.addEventListener('resize', function () {
    Konva.pixelRatio = window.devicePixelRatio;
    // update pixel ratio of existing canvas
    imageLayer.canvas.setPixelRatio(Konva.pixelRatio);
    imageLayer.draw();

    overlayLayer.canvas.setPixelRatio(Konva.pixelRatio);
    overlayLayer.draw();

})

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


overlayLayer.draw();

const doZoom = (layer) => {

    var scaleBy = 1.2;
    stage.on('wheel', (e) => {


        // stop default scrolling
        e.evt.preventDefault();

        var oldScale = layer.scaleX();
        var pointer = stage.getPointerPosition();

        var mousePointTo = {
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

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        layer.scale({x: newScale, y: newScale});

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        layer.position(newPos);


    });
}

doZoom(imageLayer);


const sceneWidth = stage.attrs.width;
const sceneHeight = stage.attrs.height;

function fitStageIntoParentContainer() {
    var container = document.querySelector('#kontainer');
    container.style.width = '100%';
    container.style.height = '100%';

    // now we need to fit stage into parent container
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    // var scale = containerWidth / sceneWidth;

    stage.width(containerWidth);
    stage.height(containerHeight);
    // stage.scale({ x: scale, y: scale });

    draggingRect.width(containerWidth);
    draggingRect.height(containerHeight);


}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);