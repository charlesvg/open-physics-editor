import * as opencv from "../polygon-detection/opencv.mjs";

var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 500,
    height: 500
});

const imageLayer = new Konva.Layer();
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
    fill: 'black',
});

function writeMessage(message) {
    text.text(message);
}

stage.on('pointermove', function () {
    var pointerPos = stage.getPointerPosition();
    var x = pointerPos.x - 190;
    var y = pointerPos.y - 40;
    writeMessage('x: ' + x + ', y: ' + y);
});

stage.on('pointerdown', function () {
    addCircle();
});




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

let contours = await opencv.getVertices(imageLayer.getNativeCanvasElement());

for (let contour of contours) {
    let color = getRandomColor();
    let lastVertex = contour[contour.length - 1];
    for (let vertex of contour) {
        let circle = new Konva.Circle({
            x: vertex.x,
            y: vertex.y,
            radius: 3,
            fill: 'red',
            stroke: color,
            strokeWidth: 2,
            draggable: true
        });
        const line = new Konva.Line({
            points: [lastVertex.x, lastVertex.y, vertex.x, vertex.y],
            stroke: color,
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });
        overlayLayer.add(line);
        lastVertex = vertex;
        overlayLayer.add(circle);
    }
}

overlayLayer.draw();