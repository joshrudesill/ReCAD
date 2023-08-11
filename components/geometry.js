import { addSelectedGeometry } from "@/features/drawingControlSlice";
import { Line, Rect, Circle, RegularPolygon, Shape } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import SnapPoints from "./snapping/snapPoints";
import { get_distance_4p } from "recad-wasm";
export default function Geometry() {
  const { realGeometry, selectedGeometry, stageZoomScaleInverse } = useSelector(
    (state) => state.drawingControl
  );

  return (
    realGeometry.length > 0 &&
    realGeometry.map((geo) => (
      <GeoWithKey
        key={geo.key}
        geo={geo}
        stageZoomScaleInverse={stageZoomScaleInverse}
        selectedGeometry={selectedGeometry}
      />
    ))
  );
}

function GeoWithKey({ geo, stageZoomScaleInverse, selectedGeometry }) {
  const dispatch = useDispatch();
  if (geo.gType === "line") {
    return (
      <>
        <Line
          points={[geo.startingX, geo.startingY, geo.endingX, geo.endingY]}
          closed
          strokeWidth={1 * stageZoomScaleInverse}
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
  if (geo.gType === "polygon") {
    return (
      <>
        <RegularPolygon
          x={geo.startingX}
          y={geo.startingY}
          sides={geo.sides}
          radius={get_distance_4p(
            geo.startingX,
            geo.startingY,
            geo.endingX,
            geo.endingY
          )}
          rotation={
            //in rust eventually
            (Math.atan2(
              geo.startingY - geo.endingY,
              geo.startingX - geo.endingX
            ) *
              180) /
              Math.PI -
            90
          }
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
  if (geo.gType === "curve") {
    return (
      <Shape
        hitStrokeWidth={15 * stageZoomScaleInverse}
        onClick={() => dispatch(addSelectedGeometry(geo))}
        stroke={
          selectedGeometry.length > 0
            ? selectedGeometry.some((g) => g.key === geo.key)
              ? "red"
              : "black"
            : "black"
        }
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(geo.startingX, geo.startingY);
          context.quadraticCurveTo(
            geo.quadraticCurveAnchor.x,
            geo.quadraticCurveAnchor.y,
            geo.endingX,
            geo.endingY
          );
          context.fillStrokeShape(shape);
          // Basis for custom bezier
        }}
      />
    );
  }
  if (geo.gType === "cap") {
    return (
      <>
        <Shape
          hitStrokeWidth={15 * stageZoomScaleInverse}
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.arc(
              (geo.endingX + geo.startingX) * 0.5,
              (geo.endingY + geo.startingY) * 0.5,
              get_distance_4p(
                geo.startingX,
                geo.startingY,
                geo.endingX,
                geo.endingY
              ) * 0.5,
              Math.atan2(
                geo.endingY - geo.startingY,
                geo.endingX - geo.startingX
              ),
              Math.atan2(
                geo.endingY - geo.startingY,
                geo.endingX - geo.startingX
              ) + Math.PI,
              false
            );
            context.fillStrokeShape(shape);
          }}
          fillEnabled={false}
          onClick={() => dispatch(addSelectedGeometry(geo))}
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === geo.key)
                ? "red"
                : "black"
              : "black"
          }
        />
      </>
    );
  }
}
