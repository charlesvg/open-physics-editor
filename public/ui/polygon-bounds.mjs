export function polygonBounds(polygon){
    let xMin = Infinity,
        xMax = -Infinity,
        yMin = Infinity,
        yMax = -Infinity;

    for (let i = 0, l = polygon.length; i < l; i++){
        const p = polygon[i],
            x = p.x,
            y = p.y;

        if (x !== undefined && isFinite(x) && y !== undefined && isFinite(y)){
            if (x < xMin) xMin = x;
            if (x > xMax) xMax = x;
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }
    }

    return {x1:xMin, y1:yMin, x2: xMax, y2: yMax};
}