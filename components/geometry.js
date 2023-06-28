import { addSelectedGeometry } from "@/features/drawingControlSlice";
import { Line, Rect, Circle } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import SnapPoints from "./snapping/snapPoints";

export default function Geometry() {
  const { realGeometry, selectedGeometry, stageZoomScaleInverse } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  return (
    realGeometry.length > 0 &&
    realGeometry.map((geo) => {
      if (geo.gType === 1) {
        return (
          <>
            <Line
              points={[geo.startingX, geo.startingY, geo.endingX, geo.endingY]}
              closed
              strokeWidth={0.5}
              stroke={
                selectedGeometry.length > 0
                  ? selectedGeometry.some((g) => g.key === geo.key)
                    ? "red"
                    : "black"
                  : "black"
              }
              hitStrokeWidth={10 * stageZoomScaleInverse}
              key={geo.key}
              onClick={() => {
                dispatch(addSelectedGeometry(geo));
              }}
            />
            <SnapPoints geometry={geo} />
          </>
        );
      }
      if (geo.gType === 2) {
        return (
          <>
            <Rect
              x={geo.startingX}
              y={geo.startingY}
              width={-(geo.startingX - geo.endingX)}
              height={-(geo.startingY - geo.endingY)}
              strokeWidth={1}
              hitStrokeWidth={10 * stageZoomScaleInverse}
              closed
              stroke={
                selectedGeometry.length > 0
                  ? selectedGeometry.some((g) => g.key === geo.key)
                    ? "red"
                    : "black"
                  : "black"
              }
              key={geo.key}
              onClick={() => dispatch(addSelectedGeometry(geo))}
              fillEnabled={false}
            />
            <SnapPoints geometry={geo} />
          </>
        );
      }
      if (geo.gType === 3) {
        return (
          <>
            <Circle
              x={geo.startingX}
              y={geo.startingY}
              radius={Math.abs(
                Math.sqrt(
                  Math.pow(geo.startingX - geo.endingX, 2) +
                    Math.pow(geo.startingY - geo.endingY, 2)
                )
              )}
              stroke={
                selectedGeometry.length > 0
                  ? selectedGeometry.some((g) => g.key === geo.key)
                    ? "red"
                    : "black"
                  : "black"
              }
              onClick={() => dispatch(addSelectedGeometry(geo))}
              key={geo.key}
              hitStrokeWidth={10 * stageZoomScaleInverse}
              strokeWidth={1}
              fillEnabled={false}
            />
            <SnapPoints geometry={geo} />
          </>
        );
      }
    })
  );
}
