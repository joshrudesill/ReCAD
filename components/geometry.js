import { Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function Geometry() {
  const realGeometry = useSelector(
    (state) => state.drawingControl.realGeometry
  );
  return (
    realGeometry.length > 0 &&
    realGeometry.map((geo) => {
      if (geo.gType === 1) {
        return (
          <Line
            points={[geo.startingX, geo.startingY, geo.endingX, geo.endingY]}
            closed
            stroke='black'
          />
        );
      }
      if (geo.gType === 2) {
        return (
          <Rect
            x={geo.startingX}
            y={geo.startingY}
            width={-(geo.startingX - geo.endingX)}
            height={-(geo.startingY - geo.endingY)}
            closed
            stroke='black'
          />
        );
      }
    })
  );
}
