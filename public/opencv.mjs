const DEBUG_OPENCV = false;
function createCanvas() {
    let c = document.createElement('canvas');
    let container = document.getElementById('container');
    c.height = 100;
    c.width = 100;
    container.appendChild(c);
    return c;
}

function contours(src) {
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


    if (DEBUG_OPENCV) {
        cv.imshow(createCanvas(), dst);
    }
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
    mergedPlanes.push_back(A);
    mergedPlanes.push_back(A);
    mergedPlanes.push_back(A);
    cv.merge(mergedPlanes, dst);

    if (DEBUG_OPENCV) {
        cv.imshow(createCanvas(), dst);
    }

    // cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);

    let vertices = contours(dst);


    // cleanup
    src.delete();
    dst.delete();
    rgbaPlanes.delete();
    mergedPlanes.delete();
    return vertices;
}

let onOpenCvInitialized;

export async function getVertices(canvas) {
    await new Promise((resolve, reject) => {
        onOpenCvInitialized = () => {
            resolve();
        }
    });
    try {

        let c = document.createElement('canvas');
        let container = document.getElementById('container');
        c.height = canvas.clientHeight;
        c.width = canvas.clientWidth;
        c.style.width = canvas.clientWidth + 'px';
        c.style.height = canvas.clientHeight + 'px';
        c.style.display = 'none';
        container.appendChild(c);

        let destCtx = c.getContext('2d');
        destCtx.drawImage(canvas, 0, 0, canvas.width,canvas.height, 0,0,c.width, c.height);

        let vertices =charles(c);
        c.remove();



        return vertices;
    } catch (e) {
        console.error(e);
    }
}


// See https://stackoverflow.com/questions/56671436/cv-mat-is-not-a-constructor-opencv/63211547#63211547
// and https://forum.opencv.org/t/opencv-js-built-file-not-working/14866/2
// and https://docs.opencv.org/4.x/d0/d84/tutorial_js_usage.html
const openCvScript = document.createElement('script');
openCvScript.src = './opencv.js';
openCvScript.async = true;
openCvScript.onload = () => {
    cv['onRuntimeInitialized'] = () => {
        onOpenCvInitialized();
    }
}
document.head.appendChild(openCvScript);
