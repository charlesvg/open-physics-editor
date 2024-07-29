function createCanvas() {
    let c = document.createElement('canvas');
    let container = document.getElementById('container');
    c.height = 300;
    c.width = 300;
    container.appendChild(c);
    return c;
}

function contours(canvas) {
    let src = cv.imread(canvas);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(
        src,
        src,
        155,
        255,
        cv.THRESH_BINARY_INV
    );
    cv.findContours(
        src,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE
    );

    const getVerts = (matVector) => {
        let vertices = [];
        // See https://github.com/opencv/opencv/issues/16162 for more info
        const vectorSize = matVector.size().width * matVector.size().height;

        for (let j = 0; j < vectorSize; j++) {
            const [x, y] = matVector.intPtr(j);
            const vertex = { x, y };
            vertices.push(vertex);
            // console.log('vertex', vertex);
        }
        return vertices;
    }

    let poly = new cv.MatVector();
    let vertices = [];
    for (let i = 0; i < contours.size(); ++i) {
        let tmp = new cv.Mat();
        let cnt = contours.get(i);
        // You can try more different parameters
        cv.approxPolyDP(cnt, tmp, 7, true);
        vertices = vertices.concat(getVerts(tmp));
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





    // let vertices = [];
    // for (let i = 0; i < contours.size(); ++i) {
    //     let cnt = contours.get(i);
    //     vertices = vertices.concat(getVerts(cnt));
    // }


    cv.imshow(createCanvas(), dst);
    src.delete();
    dst.delete();
    hierarchy.delete();
    contours.delete();
    poly.delete();

    return vertices;

}

function charles(canvas) {
    let src = cv.imread(canvas, cv.IMREAD_UNCHANGED);
    let dst = new cv.Mat();
    let rgbaPlanes = new cv.MatVector();
    let mergedPlanes = new cv.MatVector();
    // Split the src
    cv.split(src, rgbaPlanes);
    // Get A channel
    let A = rgbaPlanes.get(3);
    mergedPlanes.push_back(A);
    cv.merge(mergedPlanes, dst);

    let modifiedCanvas = createCanvas();

    cv.imshow(modifiedCanvas, dst);

    // cleanup
    src.delete();
    dst.delete();
    rgbaPlanes.delete();
    mergedPlanes.delete();
    return modifiedCanvas;
}

let resolver;
let executor = (resolve, reject) => {

    resolver = resolve;
    console.log("resolver is", resolver);
};

let onOpenCvLoad;
function openCvReady() {
    onOpenCvLoad();
}



export async function getVertices(canvas) {
    await new Promise((resolve, reject) => {
        onOpenCvLoad = () => {
            resolve();
        }
    });
    try {
        let c = charles(canvas);
        let vertices = contours(c);
        return vertices;
    } catch (e) {
        console.error(e);
    }
}

window.Module = {
    onRuntimeInitialized() { openCvReady(); }
};

