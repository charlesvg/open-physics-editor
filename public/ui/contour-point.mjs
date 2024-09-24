export class ContourPoint {
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
