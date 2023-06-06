import { addSelectedGeometry } from "@/features/drawingControlSlice";
import { Line, Rect, Circle } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

export default function Geometry() {
  const {
    realGeometry,
    selectedGeometry,
    stageZoomScale,
    stageZoomScaleInverse,
  } = useSelector((state) => state.drawingControl);
  const dispatch = useDispatch();
  return (
    realGeometry.length > 0 &&
    realGeometry.map((geo) => {
      if (geo.gType === 1) {
        return (
          <>
            <Line
              points={[geo.startingX, geo.startingY, geo.endingX, geo.endingY]}
              x={geo.stageX}
              y={geo.stageY}
              closed
              strokeWidth={0.5}
              stroke={
                selectedGeometry.length > 0
                  ? selectedGeometry.includes(geo.key)
                    ? "red"
                    : "black"
                  : "black"
              }
              hitStrokeWidth={10 * stageZoomScaleInverse}
              key={geo.key}
              onClick={() => dispatch(addSelectedGeometry(geo.key))}
            />
          </>
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
            stroke={
              selectedGeometry.length > 0
                ? selectedGeometry.includes(geo.key)
                  ? "red"
                  : "black"
                : "black"
            }
            key={geo.key}
            onClick={() => dispatch(addSelectedGeometry(geo.key))}
          />
        );
      }
    })
  );
}
