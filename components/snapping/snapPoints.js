import { useEffect, useState } from "react";

export default function SnapPoints() {
  const [geoType, setGeoType] = useState(""); //or props
  const [snapPoints, setSnapPoints] = useState([]);
  useEffect(() => {
    // calc points based on geo type, should return starting points for circles with a fixed radius that depends on zoom scale
    //line - start, end, center
    //rect - four corners, center, center of sides
    //circle - center, quadrants
  }, []);
  return snapPoints.map((p) => <></>);
  //component that adds circle and a square that becomes visible if the circle is hovered
  // when hovered the component needs to dispatch an action
}
