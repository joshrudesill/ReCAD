import { addSelectedGeometry } from "@/features/drawingControlSlice";
import { Line, Rect, Circle } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import SnapPoints from "./snapping/snapPoints";
import { get_distance_4p } from "@/public/pkg/recad_wasm_bg.wasm";
export default function Geometry() {
  const { realGeometry, selectedGeometry, stageZoomScaleInverse } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  return (
    realGeometry.length > 0 &&
    realGeometry.map((geo) => {
      if (geo.gType === "line") {
        return (
          <>
            <Line
              points={[geo.startingX, geo.startingY, geo.endingX, geo.endingY]}
              closed
              strokeWidth={0.5 * stageZoomScaleInverse}
              stroke={
                selectedGeometry.length > 0
                  ? selectedGeometry.some((g) => g.key === geo.key)
                    ? "red"
                    : "black"
                  : "black"
              }
              hitStrokeWidth={15 * stageZoomScaleInverse}
              key={geo.key}
              onClick={() => {
                dispatch(addSelectedGeometry(geo));
              }}
            />
            <SnapPoints geometry={geo} />
          </>
        );
      }
      if (geo.gType === "rect") {
        return (
          <>
            <Rect
              x={geo.startingX}
              y={geo.startingY}
              width={-(geo.startingX - geo.endingX)}
              height={-(geo.startingY - geo.endingY)}
              strokeWidth={0.5 * stageZoomScaleInverse}
              hitStrokeWidth={15 * stageZoomScaleInverse}
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
      if (geo.gType === "circle") {
        return (
          <>
            <Circle
              x={geo.startingX}
              y={geo.startingY}
              radius={get_distance_4p(
                geo.startingX,
                geo.startingY,
                geo.endingX,
                geo.endingY
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
              hitStrokeWidth={15 * stageZoomScaleInverse}
              strokeWidth={0.5 * stageZoomScaleInverse}
              fillEnabled={false}
            />
            <SnapPoints geometry={geo} />
          </>
        );
      }
    })
  );
}
