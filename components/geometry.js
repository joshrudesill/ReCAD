import { addSelectedGeometry } from "@/features/drawingControlSlice";
import { Line, Rect, Circle, RegularPolygon, Shape } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import SnapPoints from "./snapping/snapPoints";
import React from "react";
import { get_distance_4p } from "recad-wasm";
export default function Geometry() {
  const {
    realGeometry,
    selectedGeometry,
    stageZoomScaleInverse,
    virtualGeometryBeingDrawn,
    virtualGeometry,
  } = useSelector((state) => state.drawingControl);
  const dispatch = useDispatch();
  return (
    realGeometry.length > 0 &&
    realGeometry.map((geo) => (
      <GeoWithKey
        key={geo.key}
        gkey={geo.key}
        startingX={geo.startingX}
        startingY={geo.startingY}
        endingX={geo.endingX}
        endingY={geo.endingY}
        gType={geo.gType}
        stageZoomScaleInverse={stageZoomScaleInverse}
        selectedGeometry={selectedGeometry}
        virtualGeometry={virtualGeometry}
        virtualGeometryBeingDrawn={virtualGeometryBeingDrawn}
        dispatch={dispatch}
      />
    ))
  );
}

const GeoWithKey = React.memo(function GeoWithKey({
  startingX,
  startingY,
  endingX,
  endingY,
  gType,
  gkey,
  stageZoomScaleInverse,
  selectedGeometry,
  virtualGeometry,
  virtualGeometryBeingDrawn,
  dispatch,
}) {
  if (gType === "line") {
    return (
      <>
        <Line
          shadowForStrokeEnabled={false}
          points={[startingX, startingY, endingX, endingY]}
          closed
          strokeWidth={1 * stageZoomScaleInverse}
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === gkey)
                ? "red"
                : "black"
              : "black"
          }
          hitStrokeWidth={15 * stageZoomScaleInverse}
          onClick={() => {
            dispatch(addSelectedGeometry(gkey));
          }}
        />
        <SnapPoints
          startingX={startingX}
          startingY={startingY}
          endingX={endingX}
          endingY={endingY}
        />
      </>
    );
  }
  if (gType === "rect") {
    return (
      <>
        <Rect
          shadowForStrokeEnabled={false}
          x={startingX}
          y={startingY}
          width={-(startingX - endingX)}
          height={-(startingY - endingY)}
          strokeWidth={0.5 * stageZoomScaleInverse}
          hitStrokeWidth={15 * stageZoomScaleInverse}
          closed
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === gkey)
                ? "red"
                : "black"
              : "black"
          }
          onClick={() => dispatch(addSelectedGeometry(gkey))}
          fillEnabled={false}
        />
        <SnapPoints
          startingX={startingX}
          startingY={startingY}
          endingX={endingX}
          endingY={endingY}
        />
      </>
    );
  }
  if (gType === "circle") {
    return (
      <>
        <Circle
          x={startingX}
          y={startingY}
          shadowForStrokeEnabled={false}
          radius={get_distance_4p(startingX, startingY, endingX, endingY)}
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === gkey)
                ? "red"
                : "black"
              : "black"
          }
          onClick={() => dispatch(addSelectedGeometry(gkey))}
          key={key}
          hitStrokeWidth={15 * stageZoomScaleInverse}
          strokeWidth={0.5 * stageZoomScaleInverse}
          fillEnabled={false}
        />
        <SnapPoints
          startingX={startingX}
          startingY={startingY}
          endingX={endingX}
          endingY={endingY}
          vg={virtualGeometry}
          virtualGeometryBeingDrawn={virtualGeometryBeingDrawn}
        />
      </>
    );
  }
  if (gType === "polygon") {
    return (
      <>
        <RegularPolygon
          x={startingX}
          y={startingY}
          shadowForStrokeEnabled={false}
          sides={sides}
          radius={get_distance_4p(startingX, startingY, endingX, endingY)}
          rotation={
            //in rust eventually
            (Math.atan2(startingY - endingY, startingX - endingX) * 180) /
              Math.PI -
            90
          }
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === gkey)
                ? "red"
                : "black"
              : "black"
          }
          onClick={() => dispatch(addSelectedGeometry(gkey))}
          key={key}
          hitStrokeWidth={15 * stageZoomScaleInverse}
          strokeWidth={0.5 * stageZoomScaleInverse}
          fillEnabled={false}
        />
        <SnapPoints
          startingX={startingX}
          startingY={startingY}
          endingX={endingX}
          endingY={endingY}
        />
      </>
    );
  }
  if (gType === "curve") {
    return (
      <>
        <Shape
          hitStrokeWidth={15 * stageZoomScaleInverse}
          shadowForStrokeEnabled={false}
          onClick={() => dispatch(addSelectedGeometry(gkey))}
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === gkey)
                ? "red"
                : "black"
              : "black"
          }
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.moveTo(startingX, startingY);
            context.quadraticCurveTo(
              quadraticCurveAnchor.x,
              quadraticCurveAnchor.y,
              endingX,
              endingY
            );
            context.fillStrokeShape(shape);
            // Basis for custom bezier
          }}
        />
        <SnapPoints
          startingX={startingX}
          startingY={startingY}
          endingX={endingX}
          endingY={endingY}
        />
      </>
    );
  }
  if (gType === "cap") {
    return (
      <>
        <Shape
          hitStrokeWidth={15 * stageZoomScaleInverse}
          shadowForStrokeEnabled={false}
          sceneFunc={(context, shape) => {
            context.beginPath();
            context.arc(
              (endingX + startingX) * 0.5,
              (endingY + startingY) * 0.5,
              get_distance_4p(startingX, startingY, endingX, endingY) * 0.5,
              Math.atan2(endingY - startingY, endingX - startingX),
              Math.atan2(endingY - startingY, endingX - startingX) + Math.PI,
              false
            );
            context.fillStrokeShape(shape);
          }}
          fillEnabled={false}
          onClick={() => dispatch(addSelectedGeometry(gkey))}
          stroke={
            selectedGeometry.length > 0
              ? selectedGeometry.some((g) => g.key === gkey)
                ? "red"
                : "black"
              : "black"
          }
        />
        <SnapPoints
          startingX={startingX}
          startingY={startingY}
          endingX={endingX}
          endingY={endingY}
        />
      </>
    );
  }
});
