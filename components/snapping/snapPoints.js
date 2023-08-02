import { useEffect, useState } from "react";
import { Circle } from "react-konva";
import SnapArea from "./snapArea";
import { get_distance_4p } from "@/pkg/recad_wasm";
export default function SnapPoints({ geometry }) {
  const [snapPoints, setSnapPoints] = useState([]);
  const calculateLineSnaps = () => {
    let snaps = [];
    const { startingX, startingY, endingX, endingY } = geometry;
    snaps.push({ x: startingX, y: startingY });
    snaps.push({ x: endingX, y: endingY });
    snaps.push({ x: (endingX + startingX) / 2, y: (endingY + startingY) / 2 });
    setSnapPoints([...snaps]);
  };
  const calculateRectSnaps = () => {
    let snaps = [];
    const { startingX, startingY, endingX, endingY } = geometry;
    const rectHeight = -(startingX - endingX);
    const rectWidth = -(startingY - endingY);

    // Four corners
    snaps.push({ x: startingX, y: startingY });
    snaps.push({ x: startingX + rectHeight, y: startingY });
    snaps.push({ x: startingX, y: startingY + rectWidth });
    snaps.push({ x: startingX + rectHeight, y: startingY + rectWidth });

    // Center Points
    snaps.push({ x: startingX + rectHeight / 2, y: startingY + rectWidth });
    snaps.push({ x: startingX + rectHeight / 2, y: startingY });
    snaps.push({ x: startingX, y: startingY + rectWidth / 2 });
    snaps.push({ x: startingX + rectHeight, y: startingY + rectWidth / 2 });

    setSnapPoints([...snaps]);
  };

  const calculateCircleSnaps = () => {
    let snaps = [];
    const { startingX, startingY, endingX, endingY } = geometry;
    const circleRadius = get_distance_4p(
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
    const { startingX, startingY, endingX, endingY, sides } = geometry;
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
  useEffect(() => {
    // calc points based on geo type, should return starting points for circles with a fixed radius that depends on zoom scale
    //line - start, end, center
    //rect - four corners, center, center of sides
    //circle - center, quadrants
    if (geometry.gType === "line") {
      calculateLineSnaps();
    } else if (geometry.gType === "rect") {
      calculateRectSnaps();
    } else if (geometry.gType === "circle") {
      calculateCircleSnaps();
    } else if (geometry.gType === "polygon") {
      calculatePolygonSnaps();
    }
  }, [geometry]);

  return snapPoints?.map((p, i) => (
    <SnapArea p={p} key={i} geometry={geometry} />
  ));
  //component that adds circle and a square that becomes visible if the circle is hovered
  // when hovered the component needs to dispatch an action
}
