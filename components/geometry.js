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
            x={geo.stageX}
            y={geo.stageY}
            closed
            strokeWidth={0.5}
            stroke='black'
            key={geo.key}
          />
        );
      }
      if (geo.gType === 2) {
        return (
          <Rect
            x={geo.startingX + geo.stageX}
            y={geo.startingY + geo.stageY}
            width={-(geo.startingX - geo.endingX)}
            height={-(geo.startingY - geo.endingY)}
            strokeWidth={0.5}
            closed
            stroke='black'
            key={geo.key}
          />
        );
      }
    })
  );
}
