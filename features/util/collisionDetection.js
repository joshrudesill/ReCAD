import { get_distance_4p, rotate_point } from "recad-wasm";
import {
  check_line_collision,
  check_rect_collision,
  check_circle_collision,
  check_polygon_collision,
  check_quadratic_curve_intersect,
  check_cap_collision,
} from "recad-wasm/recad_wasm";

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

export function rustTemp(sx, sy, ex, ey) {
  // Calc angle in radians
  return Math.atan2(ey - sy, ex - sx);
}
var lerp = function (a, b, x) {
  return a + x * (b - a);
};
export function calcQLintersects(p1, p2, p3, a1, a2) {
  var intersections = [];

  // inverse line normal
  var normal = {
    x: a1.y - a2.y,
    y: a2.x - a1.x,
  };

  // Q-coefficients
  var c2 = {
    x: p1.x + p2.x * -2 + p3.x,
    y: p1.y + p2.y * -2 + p3.y,
  };

  var c1 = {
    x: p1.x * -2 + p2.x * 2,
    y: p1.y * -2 + p2.y * 2,
  };

  var c0 = {
    x: p1.x,
    y: p1.y,
  };

  // Transform to line
  var coefficient = a1.x * a2.y - a2.x * a1.y;
  var a = normal.x * c2.x + normal.y * c2.y;
  var b = (normal.x * c1.x + normal.y * c1.y) / a;
  var c = (normal.x * c0.x + normal.y * c0.y + coefficient) / a;

  // solve the roots
  var roots = [];
  var d = b * b - 4 * c;
  if (d > 0) {
    var e = Math.sqrt(d);
    roots.push((-b + Math.sqrt(d)) / 2);
    roots.push((-b - Math.sqrt(d)) / 2);
  } else if (d == 0) {
    roots.push(-b / 2);
  }

  // calc the solution points
  for (var i = 0; i < roots.length; i++) {
    var minX = Math.min(a1.x, a2.x);
    var minY = Math.min(a1.y, a2.y);
    var maxX = Math.max(a1.x, a2.x);
    var maxY = Math.max(a1.y, a2.y);
    var t = roots[i];
    if (t >= 0 && t <= 1) {
      // possible point -- pending bounds check
      var point = {
        x: lerp(lerp(p1.x, p2.x, t), lerp(p2.x, p3.x, t), t),
        y: lerp(lerp(p1.y, p2.y, t), lerp(p2.y, p3.y, t), t),
      };
      var x = point.x;
      var y = point.y;
      // bounds checks
      if (a1.x == a2.x && y >= minY && y <= maxY) {
        // vertical line
        intersections.push(point);
      } else if (a1.y == a2.y && x >= minX && x <= maxX) {
        // horizontal line
        intersections.push(point);
      } else if (x >= minX && y >= minY && x <= maxX && y <= maxY) {
        // line passed bounds check
        intersections.push(point);
      }
    }
  }
  return intersections;
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
      if (
        // rust
        check_line_collision(
          bL.x,
          bL.y,
          tR.x,
          tR.y,
          startingX,
          startingY,
          endingX,
          endingY
        )
      ) {
        foundKeys.push(geometry[i].key);
        continue;
      } /*
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
      */
    }
    if (gType === "rect") {
      // Rectangle
      if (
        check_rect_collision(
          bL.x,
          bL.y,
          tR.x,
          tR.y,
          startingX,
          startingY,
          endingX,
          endingY
        )
      ) {
        foundKeys.push(geometry[i].key);
        continue;
      }
      /*
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
      } */
    }
    if (gType === "circle") {
      if (
        check_circle_collision(
          bL.x,
          bL.y,
          tR.x,
          tR.y,
          startingX,
          startingY,
          endingX,
          endingY
        )
      ) {
        foundKeys.push(geometry[i].key);
        continue;
      }
      // Circle
      // Here were checking whether any of the selection box points fall inside of the circle or if the circle center is inside the box
      // Lets first make sure the circle center isnt inside the selection box
      /*
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
      }*/
    }
    if (gType === "polygon") {
      if (
        check_polygon_collision(
          bL.x,
          bL.y,
          tR.x,
          tR.y,
          startingX,
          startingY,
          endingX,
          endingY,
          geometry[i].sides
        )
      ) {
        foundKeys.push(geometry[i].key);
        continue;
      }
    }
    if (gType === "curve") {
      const { quadraticCurveAnchor } = geometry[i];
      if (
        // rust
        check_quadratic_curve_intersect(
          bL.x,
          bL.y,
          tR.x,
          tR.y,
          startingX,
          startingY,
          quadraticCurveAnchor.x,
          quadraticCurveAnchor.y,
          endingX,
          endingY
        )
      ) {
        foundKeys.push(geometry[i].key);
        continue;
      }
    }
    if (gType === "cap") {
      // First check if starting or ending point inside box
      // If so we can exit here and avoid unecessary complexity

      if (startingX >= bL.x && startingX <= bR.x) {
        // X in bounds
        if (startingY >= bL.y && startingY <= tR.y) {
          // Y in bounds, one point inside box
          foundKeys.push(geometry[i].key);
          continue;
        }
      }
      // Do same for end point
      if (endingX >= bL.x && endingX <= bR.x) {
        // X in bounds
        if (endingY >= bL.y && endingY <= tR.y) {
          // Y in bounds, one point inside box
          foundKeys.push(geometry[i].key);
          continue;
        }
      }

      // No point inside box, now what will happen is we will detect collision between the 4 box sides and a CIRCLE, not a semicircle
      // I couldnt find any semicircle algorithms so I check a full circle
      // If any hits I rotate the point so that I can detect if its angle from the center point of the circle is between 2 pi and pi
      // The reason for this is the unit circle.. I rotate the point the amount of degrees the halfcircle is away from a horizontal halfcircle so I can have nice bounds to test it
      // This could be done rotated 180 degrees as well in which case I would check 0 and pi

      const circle = {
        radius: get_distance_4p(startingX, startingY, endingX, endingY) / 2,
        center: {
          x: (startingX + endingX) / 2,
          y: (startingY + endingY) / 2,
        },
      };
      const lines = [
        { p1: bL, p2: tL },
        { p1: bL, p2: bR },
        { p1: bR, p2: tR },
        { p1: tR, p2: tL },
      ];
      let hits = [];
      for (const line of lines) {
        let hit = inteceptCircleLineSeg(circle, line);
        if (hit.length > 0) hits.push(...hit);
      }

      //Rotate points around center, then check if their angle is within 2PI and PI
      if (hits.length > 0) {
        const rotatedHits = hits.map((hit) => {
          const p = rotate_point(
            hit.x,
            hit.y,
            circle.center.x,
            circle.center.y,
            2 * Math.PI -
              (Math.atan2(startingY - endingY, startingX - endingX) + Math.PI)
          );
          return {
            x: p[0],
            y: p[1],
          };
        });

        for (const hit of rotatedHits) {
          const angle =
            Math.atan2(circle.center.y - hit.y, circle.center.x - hit.x) +
            Math.PI;
          if (angle <= 2 * Math.PI && angle >= Math.PI) {
            foundKeys.push(geometry[i].key);
            continue;
          }
        }
      }

      // rust
      /*check_cap_collision(
          bL.x,
          bL.y,
          tR.x,
          tR.y,
          startingX,
          startingY,
          endingX,
          endingY
          console.log(
            "angle: ",
            Math.atan2(startingY - endingY, startingX - endingX) + Math.PI
          );
          console.log(
            "center: ",
            (startingX + endingX) / 2,
            (startingY + endingY) / 2
          );
          console.log(
            inteceptCircleLineSeg(
              {
                radius:
                  get_distance_4p(startingX, startingY, endingX, endingY) / 2,
                center: {
                  x: (startingX + endingX) / 2,
                  y: (startingY + endingY) / 2,
                },
              },
              {
                p1: { x: bL.x, y: bL.y },
                p2: { x: tL.x, y: tL.y },
              }
            )
        )*/
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
function inteceptCircleLineSeg(circle, line) {
  var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
  v1 = {};
  v2 = {};
  v1.x = line.p2.x - line.p1.x;
  v1.y = line.p2.y - line.p1.y;
  v2.x = line.p1.x - circle.center.x;
  v2.y = line.p1.y - circle.center.y;
  b = v1.x * v2.x + v1.y * v2.y;
  c = 2 * (v1.x * v1.x + v1.y * v1.y);
  b *= -2;
  d = Math.sqrt(
    b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius)
  );
  if (isNaN(d)) {
    // no intercept
    return [];
  }
  u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
  u2 = (b + d) / c;
  retP1 = {}; // return points
  retP2 = {};
  ret = []; // return array
  if (u1 <= 1 && u1 >= 0) {
    // add point if on the line segment
    retP1.x = line.p1.x + v1.x * u1;
    retP1.y = line.p1.y + v1.y * u1;
    ret[0] = retP1;
  }
  if (u2 <= 1 && u2 >= 0) {
    // second add point if on the line segment
    retP2.x = line.p1.x + v1.x * u2;
    retP2.y = line.p1.y + v1.y * u2;
    ret[ret.length] = retP2;
  }
  return ret;
}
