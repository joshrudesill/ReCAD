import { useEffect, useState } from "react";
import { Circle } from "react-konva";
import SnapArea from "./snapArea";

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
    const circleRadius = Math.abs(
      Math.sqrt(
        Math.pow(startingX - endingX, 2) + Math.pow(startingY - endingY, 2)
      )
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
  useEffect(() => {
    // calc points based on geo type, should return starting points for circles with a fixed radius that depends on zoom scale
    //line - start, end, center
    //rect - four corners, center, center of sides
    //circle - center, quadrants
    if (geometry.gType === 1) {
      calculateLineSnaps();
    } else if (geometry.gType === 2) {
      calculateRectSnaps();
    } else if (geometry.gType === 3) {
      calculateCircleSnaps();
    }
  }, [geometry]);

  return snapPoints?.map((p, i) => <SnapArea p={p} key={i} />);
  //component that adds circle and a square that becomes visible if the circle is hovered
  // when hovered the component needs to dispatch an action
}
