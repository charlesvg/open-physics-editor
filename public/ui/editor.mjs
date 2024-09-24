import {EditorStage} from "./editor-stage.mjs";

var stage = new Konva.Stage({
    container: 'kontainer',   // id of container <div>
    width: 500,
    height: 500
});

const imageLayer = new Konva.Layer({draggable: true});

const editorStage = new EditorStage(stage);
await editorStage.image.drawContours();


// This fixes konva shapes becoming blurry after a zoom
window.addEventListener('resize', function () {
    Konva.pixelRatio = window.devicePixelRatio;
    // update pixel ratio of existing canvas
    imageLayer.canvas.setPixelRatio(Konva.pixelRatio);
    imageLayer.draw();
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


