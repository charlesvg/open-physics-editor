import * as opencv from "../polygon-detection/opencv.mjs";

var stage = new Konva.Stage({
    container: 'kontainer',   // id of container <div>
    width: 500,
    height: 500
});

const imageLayer = new Konva.Layer({draggable:true});
const overlayLayer = new Konva.Layer();
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
    writeMessage('x: ' + relativeX + ', y: ' + relativeY);
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
    #isDragging = false;
    #dragLine;
    #isDraggingLineStart = false;
    constructor(vertices) {
        this.#generateContourPointsFromVertices(vertices);
        this.#drawPoints();

        stage.on('pointermove',  () => {
            const pointerPos = stage.getPointerPosition();
            const x = Math.round(pointerPos.x);
            const y = Math.round(pointerPos.y);
            this.#onMouseMove(x,y);
        });
    }
    #onMouseMove(x,y) {
        if (this.#isDragging) {
            if (this.#isDraggingLineStart) {
                // this.#dragLine.
                //https://konvajs.org/docs/select_and_transform/Basic_demo.html
                // https://stackoverflow.com/questions/72603024/konva-js-get-new-point-positions-for-line-after-dragging-or-scaling
            }
        }
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
        let frontLine = this.#addFrontLine(lastVertex,newVertex);
        let backLine = this.#addBackLine(lastVertex, newVertex);
        let newPoint = new ContourPoint(circle, frontLine, backLine);
        this.#points.push(newPoint);
        circle.on('dragstart', () => {

        });
        circle.on('dragend', () => {
            this.#onDragEnd(newPoint);
        });
    }

    #onDragEnd(contourPoint) {
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
            return new Konva.Line({
                points: [fromVertex.x, fromVertex.y, toVertex.x, toVertex.y],
                stroke: 'white',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
            });
    }
}

let rawContours = await opencv.getVertices(imageLayer.getNativeCanvasElement());
let contours = [];
for (let rawContour of rawContours) {
    new Contour(rawContour);
}

let circles = [];

function addCircle() {
    let pointerPos = stage.getPointerPosition();
    let circle = new Konva.Circle({
        x: pointerPos.x,
        y: pointerPos.y,
        radius: 3,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
    if (circles.length > 0) {
        let lastCircle = circles[circles.length - 1];
        var frontLine = new Konva.Line({
            points: [lastCircle.x(), lastCircle.y(), circle.x(), circle.y()],
            stroke: 'white',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });

        var backLine = new Konva.Line({
            points: [lastCircle.x(), lastCircle.y(), circle.x(), circle.y()],
            stroke: 'black',
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round',
        });

        overlayLayer.add(backLine);
        overlayLayer.add(frontLine);
        overlayLayer.draw();
    }


    circles.push(circle);
    overlayLayer.add(circle);
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
    layer.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        var oldScale = layer.scaleX();
        var pointer = stage.getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - layer.x()) / oldScale,
            y: (pointer.y - layer.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        layer.scale({ x: newScale, y: newScale });

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
    container.style.width= '100%';
    container.style.height= '100%';

    // now we need to fit stage into parent container
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    // var scale = containerWidth / sceneWidth;

    stage.width(containerWidth );
    stage.height(containerHeight );
    // stage.scale({ x: scale, y: scale });
}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);