var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var image = new Image();
let loadImage = () => {
    return new Promise((resolve, reject) => {
        image.onload = function () {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve();
        };
        image.src = "http://www.lunapic.com/editor/premade/transparent.gif";
    });
}

await loadImage();




const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 70;

context.beginPath();
context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
context.fillStyle = 'green';
context.fill();
context.lineWidth = 5;
context.strokeStyle = '#003300';
context.stroke();