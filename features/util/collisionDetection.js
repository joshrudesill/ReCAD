/**
 * Takes the starting and ending X, Y points for a selection box or rectangle and returns said points
 * @param {number} sx Pass in starting X
 * @param {number} sy Pass in starting Y
 * @param {number} ex Pass in ending X
 * @param {number} ey Pass in ending Y
 * @returns {object} Object containing values `{ bL, bR, tL, tR }`
 */
export function normalizeBoxPoints(sx, sy, ex, ey) {
  // First need to determine which points are which depending on where the selection box started and ended
  let posX = false;
  let posY = false;
  if (sx < ex) {
    posX = true;
  }
  if (sy < ey) {
    posY = true;
  }
  // Now need to move points into proper variables
  let bL, bR, tL, tR;
  if (posX && posY) {
    bL = { x: sx, y: sy };
    bR = { x: ex, y: sy };
    tL = { x: sx, y: ey };
    tR = { x: ex, y: ey };
  } else if (!posX && posY) {
    bL = { x: ex, y: sy };
    bR = { x: sx, y: sy };
    tL = { x: ex, y: ey };
    tR = { x: sx, y: ey };
  } else if (posX && !posY) {
    bL = { x: sx, y: ey };
    bR = { x: ex, y: ey };
    tL = { x: sx, y: sy };
    tR = { x: ex, y: sy };
  } else if (!posX && !posY) {
    bL = { x: ex, y: ey };
    bR = { x: sx, y: ey };
    tL = { x: ex, y: sy };
    tR = { x: sx, y: sy };
  }
  return { bL, bR, tL, tR };
}
/**
 * Checks to see if any starting or ending points of `geometry` fall inside of the selection box
 * @param {object} normalizedPoints Normalized selection box
 * @param {Array} geometry Real geometry array
 * @returns {Array<number>} Returns keys of geometry inside the selection box
 */
export function checkGeometryCollision(normalizedPoints, geometry) {
  // This function will check if any starting or ending points in realGeometry are inside our selection box, then it will return the keys
  const { bL, bR, tL, tR } = normalizedPoints;
  let foundKeys = [];
  if (geometry.length === 0) return [];
  for (let i = 0; i < geometry.length; i++) {
    const { startingX, startingY, endingX, endingY, gType } = geometry[i];
    if (gType === "line") {
      // Line
      // First do simple check for line points inside of box
      if (startingX >= bL.x && startingX <= bR.x) {
        // StartingX is within selection box x
        if (startingY >= bL.y && startingY <= tL.y) {
          // StartingY is inside Y of selection box, therefore the point is inside the box
          foundKeys.push(geometry[i].key);
          continue;
        }
      }
      if (endingX >= bL.x && endingX <= bR.x) {
        // endingX is within selection box x
        if (endingY >= bL.y && endingY <= tL.y) {
          // endingY is inside Y of selection box, therefore the point is inside the box
          foundKeys.push(geometry[i].key);
          continue;
        }
      }
      let sides = [
        { sX: bL.x, sY: bL.y, eX: tL.x, eY: tL.y },
        { sX: tL.x, sY: tL.y, eX: tR.x, eY: tR.y },
        { sX: tR.x, sY: tR.y, eX: bR.x, eY: bR.y },
        { sX: bR.x, sY: bR.y, eX: bL.x, eY: bL.y },
      ];
      // If weve made it this far its time to check for line intersection with the box sides
      for (const side of sides) {
        if (
          checkLineIntersect(
            startingX,
            startingY,
            endingX,
            endingY,
            side.sX,
            side.sY,
            side.eX,
            side.eY
          )
        ) {
          foundKeys.push(geometry[i].key);
          break;
        }
      }
      continue;
    }
    if (gType === "rect") {
      // Rectangle
      const inputRect = normalizeBoxPoints(
        startingX,
        startingY,
        endingX,
        endingY
      );
      // This will have to be changed when rotation is added
      // Check for rect point inside of selection box and vice versa
      for (const value of Object.values(inputRect)) {
        if (value.x >= bL.x && value.x <= bR.x) {
          if (value.y >= bL.y && value.y <= tL.y) {
            foundKeys.push(geometry[i].key);
            continue;
          }
        }
      }
      for (const value of Object.values(normalizedPoints)) {
        if (value.x >= inputRect.bL.x && value.x <= inputRect.bR.x) {
          if (value.y >= inputRect.bL.y && value.y <= inputRect.tL.y) {
            foundKeys.push(geometry[i].key);
            continue;
          }
        }
      }

      // If there hasnt been a hit yet, check for side collision, just like with lines
      let selectionBoxSides = [
        { sX: bL.x, sY: bL.y, eX: tL.x, eY: tL.y },
        { sX: tL.x, sY: tL.y, eX: tR.x, eY: tR.y },
        { sX: tR.x, sY: tR.y, eX: bR.x, eY: bR.y },
        { sX: bR.x, sY: bR.y, eX: bL.x, eY: bL.y },
      ];
      let inputRectSides = [
        {
          sX: inputRect.bL.x,
          sY: inputRect.bL.y,
          eX: inputRect.tL.x,
          eY: inputRect.tL.y,
        },
        {
          sX: inputRect.tL.x,
          sY: inputRect.tL.y,
          eX: inputRect.tR.x,
          eY: inputRect.tR.y,
        },
        {
          sX: inputRect.tR.x,
          sY: inputRect.tR.y,
          eX: inputRect.bR.x,
          eY: inputRect.bR.y,
        },
        {
          sX: inputRect.bR.x,
          sY: inputRect.bR.y,
          eX: inputRect.bL.x,
          eY: inputRect.bL.y,
        },
      ];

      for (const selectionSide of selectionBoxSides) {
        for (const inputSide of inputRectSides) {
          if (
            checkLineIntersect(
              selectionSide.sX,
              selectionSide.sY,
              selectionSide.eX,
              selectionSide.eY,
              inputSide.sX,
              inputSide.sY,
              inputSide.eX,
              inputSide.eY
            )
          ) {
            foundKeys.push(geometry[i].key);
            continue;
          }
        }
      }
    }
    if (gType === "circle") {
      // Circle

      // Here were checking whether any of the selection box points fall inside of the circle or if the circle center is inside the box
      // Lets first make sure the circle center isnt inside the selection box
      if (startingX >= bL.x && startingX <= bR.x) {
        // StartingX is within selection box x
        if (startingY >= bL.y && startingY <= tL.y) {
          // StartingY is inside Y of selection box, therefore the point is inside the box
          foundKeys.push(geometry[i].key);
          continue;
        }
      }

      // Now, checking the selection box points by comparing distance from point to center of circle
      // Get circle radius
      const radius = Math.sqrt(
        Math.pow(startingX - endingX, 2) + Math.pow(startingY - endingY, 2)
      );

      // Now compare to each point, break if found
      for (const point of Object.values(normalizedPoints)) {
        let distanceToCenter = Math.sqrt(
          Math.pow(startingX - point.x, 2) + Math.pow(startingY - point.y, 2)
        );
        if (distanceToCenter < radius) {
          foundKeys.push(geometry[i].key);
          continue;
        }
      }

      // Lastly we need to check for selection box collision with circle quadrant lines, this is for if the circle is just slightly inside one side of the box

      let selectionBoxSides = [
        { sX: bL.x, sY: bL.y, eX: tL.x, eY: tL.y },
        { sX: tL.x, sY: tL.y, eX: tR.x, eY: tR.y },
        { sX: tR.x, sY: tR.y, eX: bR.x, eY: bR.y },
        { sX: bR.x, sY: bR.y, eX: bL.x, eY: bL.y },
      ];
      let circleQuadLines = [
        { sX: startingX, sY: startingY, eX: startingX + radius, eY: startingY },
        { sX: startingX, sY: startingY, eX: startingX - radius, eY: startingY },
        { sX: startingX, sY: startingY, eX: startingX, eY: startingY + radius },
        { sX: startingX, sY: startingY, eX: startingX, eY: startingY - radius },
      ];
      for (const selectionSide of selectionBoxSides) {
        for (const circleQuadLine of circleQuadLines) {
          if (
            checkLineIntersect(
              selectionSide.sX,
              selectionSide.sY,
              selectionSide.eX,
              selectionSide.eY,
              circleQuadLine.sX,
              circleQuadLine.sY,
              circleQuadLine.eX,
              circleQuadLine.eY
            )
          ) {
            foundKeys.push(geometry[i].key);
            continue;
          }
        }
      }
    }
  }
  return foundKeys;
}

function checkLineIntersect(a, b, c, d, p, q, r, s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
}
