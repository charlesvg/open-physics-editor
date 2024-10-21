import {getRandomColor} from "./random-color.mjs";
import {ContourPoint} from "./contour-point.mjs";
import {polygonBounds} from "./polygon-bounds.mjs";

export class Contour {
    #points = [];
    #layer;
    #stage;
    #isVisible = false;
    #vertices;
    #size;

    constructor(stage, layer, vertices, size) {
        this.#layer = layer;
        this.#stage = stage;
        this.#generateContourPointsFromVertices(vertices);
        this.draw();
        // this.#drawMenu(vertices);
        this.#vertices = vertices;
        this.#size = size;
    }

    // From https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript
    #get_polygon_centroid(pts) {
        const first = pts[0], last = pts[pts.length - 1];
        if (first.x !== last.x || first.y !== last.y) pts.push(first);
        let twicearea = 0,
            x = 0, y = 0,
            nPts = pts.length,
            p1, p2, f;
        for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
            p1 = pts[i];
            p2 = pts[j];
            f = p1.x * p2.y - p2.x * p1.y;
            twicearea += f;
            x += (p1.x + p2.x) * f;
            y += (p1.y + p2.y) * f;
        }
        f = twicearea * 3;
        return {x: x / f, y: y / f};
    }

    print() {
        const v = [];
        for (let vertex of this.#vertices) {
            v.push({x: vertex.x, y: vertex.y});
        }
        const centroid = this.#get_polygon_centroid(this.#vertices);
        const center = {x: this.#size.width / 2, y: this.#size.height / 2};

        return JSON.stringify({
            vertices: v,
            center: center,
            centroid: centroid
        }, null, 2);


        // console.log('x', center.x - centroid.x, 'y', center.y - centroid.y);
    }

    toggleVisibility() {
        if (this.#isVisible) {
            this.hide();
        } else {
            this.draw();
        }
    }

    hide() {
        for (let point of this.#points) {
            point.backLine.remove();
            point.frontLine.remove();
            point.circle.remove();
        }
        this.#layer.draw();
        this.#isVisible = false;
    }

    #drawMenu(vertices) {
        let bounds = polygonBounds(vertices);
        const menuRect = new Konva.Rect({
            x: bounds.x1,
            y: bounds.y1 - 30,
            width: bounds.x2 - bounds.x1,
            height: 20,
            fill: 'rgba(255,0,0,0.4)'
        });
        this.#layer.add(menuRect);

    }

    draw() {
        for (let point of this.#points) {
            this.#layer.add(point.backLine);
        }
        for (let point of this.#points) {
            this.#layer.add(point.frontLine);
        }
        for (let point of this.#points) {
            this.#layer.add(point.circle);
        }
        this.#layer.draw();
        this.#isVisible = true;
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
        const pointerPos = this.#stage.getPointerPosition();
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

