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
    console.log(snaps);
    setSnapPoints([...snaps]);
  };
  useEffect(() => {
    // calc points based on geo type, should return starting points for circles with a fixed radius that depends on zoom scale
    //line - start, end, center
    //rect - four corners, center, center of sides
    //circle - center, quadrants
    if (geometry.gType === 1) {
      calculateLineSnaps();
    }
  }, [geometry]);
  return snapPoints?.map((p, i) => <SnapArea p={p} key={i} />);
  //component that adds circle and a square that becomes visible if the circle is hovered
  // when hovered the component needs to dispatch an action
}
