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
    showSnapPoints,
    enableSnaps,
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
        sides={geo?.sides}
        gType={geo.gType}
        showSnapPoints={showSnapPoints}
        quadraticCurveAnchorX={geo?.quadraticCurveAnchor?.x}
        quadraticCurveAnchorY={geo?.quadraticCurveAnchor?.y}
        originalDimensions={geo?.originalDimensions}
        rotation={geo?.rotation}
        stageZoomScaleInverse={stageZoomScaleInverse}
        selectedGeometry={selectedGeometry}
        virtualGeometry={virtualGeometry}
        virtualGeometryBeingDrawn={virtualGeometryBeingDrawn}
        enableSnaps={enableSnaps}
        dispatch={dispatch}
      />
    ))
  );
}

const GeoWithKey = React.memo(
  function GeoWithKey({
    startingX,
    startingY,
    endingX,
    endingY,
    gType,
    gkey,
    sides,
    stageZoomScaleInverse,
    selectedGeometry,
    virtualGeometry,
    virtualGeometryBeingDrawn,
    quadraticCurveAnchorX,
    quadraticCurveAnchorY,
    originalDimensions,
    rotation,
    dispatch,
    showSnapPoints,
    enableSnaps,
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
            gType={"line"}
            showSnapPoints={showSnapPoints}
            enableSnaps={enableSnaps}
            stageZoomScaleInverse={stageZoomScaleInverse}
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
            width={originalDimensions?.width || -(startingX - endingX)}
            height={originalDimensions?.height || -(startingY - endingY)}
            strokeWidth={0.5 * stageZoomScaleInverse}
            hitStrokeWidth={15 * stageZoomScaleInverse}
            closed
            rotation={rotation ?? 0}
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
            originalDimensions={originalDimensions}
            rotation={rotation}
            gType={"rect"}
            enableSnaps={enableSnaps}
            showSnapPoints={showSnapPoints}
            stageZoomScaleInverse={stageZoomScaleInverse}
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
            hitStrokeWidth={15 * stageZoomScaleInverse}
            strokeWidth={0.5 * stageZoomScaleInverse}
            fillEnabled={false}
          />
          <SnapPoints
            startingX={startingX}
            startingY={startingY}
            endingX={endingX}
            endingY={endingY}
            gType={"circle"}
            enableSnaps={enableSnaps}
            vg={virtualGeometry}
            virtualGeometryBeingDrawn={virtualGeometryBeingDrawn}
            showSnapPoints={showSnapPoints}
            stageZoomScaleInverse={stageZoomScaleInverse}
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
            hitStrokeWidth={15 * stageZoomScaleInverse}
            strokeWidth={0.5 * stageZoomScaleInverse}
            fillEnabled={false}
          />
          <SnapPoints
            startingX={startingX}
            startingY={startingY}
            endingX={endingX}
            endingY={endingY}
            gType={"polygon"}
            enableSnaps={enableSnaps}
            sides={sides}
            showSnapPoints={showSnapPoints}
            stageZoomScaleInverse={stageZoomScaleInverse}
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
            fillEnabled={false}
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
                quadraticCurveAnchorX,
                quadraticCurveAnchorY,
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
            quadraticCurveAnchorX={quadraticCurveAnchorX}
            quadraticCurveAnchorY={quadraticCurveAnchorY}
            endingX={endingX}
            enableSnaps={enableSnaps}
            endingY={endingY}
            gType={"curve"}
            showSnapPoints={showSnapPoints}
            stageZoomScaleInverse={stageZoomScaleInverse}
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
                Math.atan2(endingY - startingY, endingX - startingX) + Math.PI,
                Math.atan2(endingY - startingY, endingX - startingX),
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
            enableSnaps={enableSnaps}
            gType={"cap"}
            showSnapPoints={showSnapPoints}
            stageZoomScaleInverse={stageZoomScaleInverse}
          />
        </>
      );
    }
  },
  (prev, next) => {
    return (
      prev.showSnapPoints === next.showSnapPoints &&
      prev.enableSnaps === next.enableSnaps &&
      prev.startingX === next.startingX &&
      prev.selectedGeometry.length === next.selectedGeometry.length &&
      prev.virtualGeometry.startingX === next.virtualGeometry.startingX
    );
  }
);
