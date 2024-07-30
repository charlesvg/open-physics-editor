import * as opencv from "../polygon-detection/opencv.mjs";

var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 500,
    height: 500
});

var layer = new Konva.Layer();
stage.add(layer);

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
var yoda = new Konva.Image({
    x: 50,
    y: 50,
    image: imageObj,
    width: 300,
    height: 300,
});

layer.add(yoda);


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

        layer.add(backLine);
        layer.add(frontLine);
        layer.draw();
    }


    circles.push(circle);
    layer.add(circle);
}


layer.add(text);

// add the layer to the stage
stage.add(layer);

layer.draw();


// This fixes konva shapes becoming blurry after a zoom
window.addEventListener('resize', function () {
    Konva.pixelRatio = window.devicePixelRatio;
    // update pixel ratio of existing canvas
    layer.canvas.setPixelRatio(Konva.pixelRatio);
    layer.draw();
})

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let contours = await opencv.getVertices(layer.getNativeCanvasElement());

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
        layer.add(line);
        lastVertex = vertex;
        layer.add(circle);
    }
}

layer.draw();