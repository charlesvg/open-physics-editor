let input = document.getElementById('fileInput');
let button = document.getElementById('button');
let canvas = document.getElementById('mainCanvas');
let container = document.getElementById('container');
let image = new Image();
let inverted = true;

function createCanvas() {
    let c = document.createElement('canvas');
    c.height = 300;
    c.width = 300;
    container.appendChild(c);
    return c;
}

function contours(canvas) {
    let src = cv.imread(canvas);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    let c = createCanvas();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(
        src,
        src,
        155,
        255,
        inverted ? cv.THRESH_BINARY_INV : cv.THRESH_BINARY
    );
    cv.findContours(
        src,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE
    );
    //for (let i = 0; i < contours.size(); ++i) {
    //  let color = new cv.Scalar(255, 255, 255);
    //  cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    //}

    let poly = new cv.MatVector();
    //cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    // approximates each contour to polygon
    for (let i = 0; i < contours.size(); ++i) {
        let tmp = new cv.Mat();
        let cnt = contours.get(i);
        // You can try more different parameters
        cv.approxPolyDP(cnt, tmp, 7, true);
        poly.push_back(tmp);
        cnt.delete();
        tmp.delete();
    }
    // draw contours with random Scalar
    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255)
        );
        cv.drawContours(dst, poly, i, color, 1, 8, hierarchy, 0);
    }
    for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        let size = cnt.size();
        const cntSize = cnt.size().width * cnt.size().height;

        for (let j = 0; j < cntSize; j++) {
            const [x, y] = cnt.intPtr(j); //cnt[j] -> ?
            const vertex = { x, y };
            console.log('vertex', vertex);
            //cv.putText(cnt,'some text', vertex, cv.FONT_HERSHEY_SIMPLEX,1, [255, 0, 255, 255]);
            //cv.circle(cnt, vertex, 3, [0, 255, 0, 255], cv.FILLED);
        }
    }

    cv.imshow(c, dst);
    src.delete();
    dst.delete();
    hierarchy.delete();
    contours.delete();
    poly.delete();

    //console.log('contours size:', contours.size());

    //cv.imshow(c, dst);
    //src.delete();
    //contours.delete();
    //hierarchy.delete();
    //dst.delete();
}

function charles() {
    let src = cv.imread(canvas, cv.IMREAD_UNCHANGED);
    let c = createCanvas();
    let dst = new cv.Mat();
    let rgbaPlanes = new cv.MatVector();
    let mergedPlanes = new cv.MatVector();
    // Split the src
    cv.split(src, rgbaPlanes);
    // Get G channel
    let A = rgbaPlanes.get(3);
    // Get B channel
    //let B = rgbaPlanes.get(2);
    // Merge G & B channels
    //mergedPlanes.push_back(G);
    mergedPlanes.push_back(A);
    cv.merge(mergedPlanes, dst);

    cv.imshow(c, dst);

    // cleanup
    src.delete();
    dst.delete();
    rgbaPlanes.delete();
    mergedPlanes.delete();
    return c;
}

image.addEventListener('load', (e) => {
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 300, 300);
});

input.addEventListener(
    'change',
    (e) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                image.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    },
    false
);




function openCvReady() {
    console.log("OpenCV.js is ready");

    button.addEventListener('click', (e) => {
        try {
            //grayScale();
            //threshold();
            //opening();
            //closing();
            //openClose();
            //openCloseBounding();

            //convexHull();
            //boundingRect();
            let c = charles();
            contours(c);
        } catch (e) {
            console.error(e);
        }
    });
}

var Module = {
    onRuntimeInitialized() { openCvReady(); }
};