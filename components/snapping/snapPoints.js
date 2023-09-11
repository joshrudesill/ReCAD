import { useEffect, useState } from "react";
import SnapArea from "./snapArea";
import {
  get_distance_4p,
  find_circle_tan_points,
  rotate_point,
} from "@/pkg/recad_wasm";
import React from "react";
import { useDispatch } from "react-redux";
export default React.memo(function SnapPoints({
  startingX,
  startingY,
  endingX,
  endingY,
  gType,
  vg = 0,
  sides = 0,
  virtualGeometryBeingDrawn = false,
  stageZoomScaleInverse,
  showSnapPoints,
  quadraticCurveAnchorX = 0,
  quadraticCurveAnchorY = 0,
  originalDimensions,
  rotation,
}) {
  const [snapPoints, setSnapPoints] = useState([]);
  const [tempSnapPoints, setTempSnapPoints] = useState([]);
  const dispatch = useDispatch();
  const calculateLineSnaps = () => {
    let snaps = [];
    snaps.push({ x: endingX, y: endingY });
    snaps.push({ x: startingX, y: startingY });
    snaps.push({
      x: (endingX + startingX) / 2,
      y: (endingY + startingY) / 2,
    });
    setSnapPoints([...snaps]);
  };
  const calculateRectSnaps = () => {
    let snaps = [];

    const rectWidth = originalDimensions?.width || -(startingX - endingX);
    const rectHeight = originalDimensions?.height || -(startingY - endingY);

    // Four corners

    snaps.push({ x: startingX + rectWidth, y: startingY });
    snaps.push({ x: startingX, y: startingY + rectHeight });
    snaps.push({ x: startingX + rectWidth, y: startingY + rectHeight });

    // Center Points
    snaps.push({ x: startingX + rectWidth / 2, y: startingY + rectHeight });
    snaps.push({ x: startingX + rectWidth / 2, y: startingY });
    snaps.push({ x: startingX, y: startingY + rectHeight / 2 });
    snaps.push({ x: startingX + rectWidth, y: startingY + rectHeight / 2 });

    if (rotation) {
      const angle = rotation * (Math.PI / 180);
      let rotatedSnaps = snaps.map((snap) => {
        let points = rotate_point(snap.x, snap.y, startingX, startingY, angle);
        return {
          x: points[0],
          y: points[1],
        };
      });
      rotatedSnaps.push({ x: startingX, y: startingY });
      setSnapPoints([...rotatedSnaps]);
    } else {
      // Add start point back at the end if no rotation
      snaps.push({ x: startingX, y: startingY });
      setSnapPoints([...snaps]);
    }
  };

  const calculateCircleSnaps = () => {
    let snaps = [];
    const circleRadius = get_distance_4p(
      // rust
      startingX,
      startingY,
      endingX,
      endingY
    );
    // Center
    snaps.push({ x: startingX, y: startingY });

    // Quadrants
    snaps.push({ x: startingX + circleRadius, y: startingY });
    snaps.push({ x: startingX, y: startingY + circleRadius });
    snaps.push({ x: startingX - circleRadius, y: startingY });
    snaps.push({ x: startingX, y: startingY - circleRadius });
    setSnapPoints([...snaps]);
  };

  const calculatePolygonSnaps = () => {
    let snaps = [];
    // Get rotation
    let rotationRads = Math.atan2(startingY - endingY, startingX - endingX);
    if (sides % 2 !== 0) rotationRads += ((Math.PI * 2) / sides) * 0.5;
    // get radius
    const polygonRadius = get_distance_4p(
      startingX,
      startingY,
      endingX,
      endingY
    );
    const rad = (2 * Math.PI) / sides;

    snaps.push({
      x: startingX + polygonRadius * Math.cos(rotationRads),
      y: startingY + polygonRadius * Math.sin(rotationRads),
    });
    snaps.push({ x: startingX, y: startingY });
    for (let i = 1; i < sides; i++) {
      const newPoints = {
        x: startingX + polygonRadius * Math.cos(rotationRads + rad * i),
        y: startingY + polygonRadius * Math.sin(rotationRads + rad * i),
      };
      snaps.push(newPoints);
    }
    setSnapPoints([...snaps]);
  };
  const calculateCurveSnaps = () => {
    // bug
    let snaps = [
      { x: startingX, y: startingY },
      { x: endingX, y: endingY },
      { x: quadraticCurveAnchorX, y: quadraticCurveAnchorY },
    ];

    setSnapPoints([...snaps]);
  };
  const calculateCapSnaps = () => {
    let snaps = [
      { x: startingX, y: startingY },
      { x: endingX, y: endingY },
    ];

    let centerSnap = {
      x: (startingX + endingX) / 2,
      y: (startingY + endingY) / 2,
    };

    let quadrantVector = {
      x: centerSnap.x - startingX,
      y: centerSnap.y - startingY,
    };

    snaps.push({
      x: -quadrantVector.y + centerSnap.x,
      y: quadrantVector.x + centerSnap.y,
    });

    snaps.push(centerSnap);

    setSnapPoints([...snaps]);
  };
  useEffect(() => {
    // calc points based on geo type, should return starting points for circles with a fixed radius that depends on zoom scale
    //line - start, end, center
    //rect - four corners, center, center of sides
    //circle - center, quadrants
    if (gType === "line") {
      calculateLineSnaps();
    } else if (gType === "rect") {
      calculateRectSnaps();
    } else if (gType === "circle") {
      calculateCircleSnaps();
    } else if (gType === "polygon") {
      calculatePolygonSnaps();
    } else if (gType === "curve") {
      calculateCurveSnaps();
    } else if (gType === "cap") {
      calculateCapSnaps();
    }
  }, [startingX, startingY, endingX, endingY, gType]);

  useEffect(() => {
    if (virtualGeometryBeingDrawn && vg.gType === "line") {
      const tangents = find_circle_tan_points(
        // rust
        startingX,
        startingY,
        get_distance_4p(startingX, startingY, endingX, endingY),
        vg.startingX,
        vg.startingY
      );
      setTempSnapPoints((prev) => [
        ...prev,
        { x: tangents[0], y: tangents[1] },
        { x: tangents[2], y: tangents[3] },
      ]);
      // ToDo -  Cleanup tangent snaps after line is drawn
    } else if (!virtualGeometryBeingDrawn) {
      setTempSnapPoints([]);
    }
  }, [virtualGeometryBeingDrawn]);

  return (
    <>
      {snapPoints?.map((p, i) => (
        <SnapArea
          px={p.x}
          py={p.y}
          key={i}
          dispatch={dispatch}
          virtualGeometryBeingDrawn={virtualGeometryBeingDrawn}
          stageZoomScaleInverse={stageZoomScaleInverse}
          showSnapPoints={showSnapPoints}
        />
      ))}
      {tempSnapPoints?.map((snap, j) => (
        <SnapArea
          px={snap.x}
          py={snap.y}
          key={j + snapPoints.length}
          dispatch={dispatch}
          virtualGeometryBeingDrawn={virtualGeometryBeingDrawn}
          stageZoomScaleInverse={stageZoomScaleInverse}
          showSnapPoints={showSnapPoints}
        />
      ))}
    </>
  );
  //component that adds circle and a square that becomes visible if the circle is hovered
  // when hovered the component needs to dispatch an action
});
