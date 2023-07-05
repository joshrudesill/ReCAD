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
 */
export function checkGeometryStartingPoints(normalizedPoints, geometry) {
  // This function will check if any starting or ending points in realGeometry are inside our selection box, then it will return the keys
  const { bL, bR, tL, tR } = normalizedPoints;
  let foundKeys = [];
  if (geometry.length === 0) return [];
  for (let i = 0; i < geometry.length; i++) {
    const { startingX, startingY, endingX, endingY, gType } = geometry[i];
    if (gType === 1) {
      // Line
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
      continue;
    }
    if (gType === 2) {
      // Rectangle
      const inputRect = normalizeBoxPoints(
        startingX,
        startingY,
        endingX,
        endingY
      );
      for (const value of Object.values(inputRect)) {
        if (value.x >= bL.x && value.x <= bR.x) {
          if (value.y >= bL.y && value.y <= tL.y) {
            foundKeys.push(geometry[i].key);
            break;
          }
        }
      }
      continue;
    }
  }
  return foundKeys;
}
