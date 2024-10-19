import {getRandomColor} from "./random-color.mjs";
import {ContourPoint} from "./contour-point.mjs";
import * as opencv from "../polygon-detection/opencv.mjs";
import {polygonBounds} from "./polygon-bounds.mjs";

export class Contour {
    #points = [];
    #layer;
    #stage;
    #isVisible = false;
    #vertices;

    constructor(stage, layer, vertices) {
        this.#layer = layer;
        this.#stage = stage;
        this.#generateContourPointsFromVertices(vertices);
        this.draw();
        // this.#drawMenu(vertices);
        this.#vertices = vertices;
    }
    print() {
        const v = [];
        for (let vertex of this.#vertices) {
            v.push({x: vertex.x, y: vertex.y });
        }
        console.log(JSON.stringify(v, null , 2));
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
            fill:'rgba(255,0,0,0.4)'
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

