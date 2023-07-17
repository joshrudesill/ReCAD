import { Circle, Group, Line, Rect, RegularPolygon } from "react-konva";
import { useSelector } from "react-redux";
import { get_distance_4p } from "@/public/pkg/recad_wasm_bg.wasm";
import { useEffect } from "react";
export default function VirtualGeometry() {
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    selectedGeometry,
    virtualGeometryBeingAltered,
    geometryAugment,
  } = useSelector((state) => state.drawingControl);
  //replace^

  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === "line") {
      return (
        <Line
          x={0}
          y={0}
          points={[
            virtualGeometry.startingX,
            virtualGeometry.startingY,
            virtualGeometry.currentX,
            virtualGeometry.currentY,
          ]}
          closed
          stroke='black'
        />
      );
    }
    //starting = 0.75
    //inverse 1 / 0.75 = 1.33
    //zoom out
    // new scale = 0.5
    //inverse = 2
    //cursor at 50,50
    //time initial scale 66, 66
    //needs 100,100

    //starting = 0.75
    //inverse 1 / 0.75 = 1.33
    //zoom out
    // new scale = 0.7
    //inverse = 1.43
    //cursor at 50,50
    //time initial scale 66, 66
    //needs 71.43, 71.43
    //1.0714
    if (virtualGeometry.gType === "rect") {
      return (
        <Rect
          x={virtualGeometry.startingX}
          y={virtualGeometry.startingY}
          width={-(virtualGeometry.startingX - virtualGeometry.currentX)}
          height={-(virtualGeometry.startingY - virtualGeometry.currentY)}
          closed
          stroke='black'
        />
      );
    }
    if (virtualGeometry.gType === "circle") {
      return (
        <>
          <Line
            x={0}
            y={0}
            points={[
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY,
            ]}
            closed
            stroke='black'
            listening={false}
            hitStrokeWidth={0}
          />
          <Circle
            x={virtualGeometry.startingX}
            y={virtualGeometry.startingY}
            radius={get_distance_4p(
              virtualGeometry.startingX,
              virtualGeometry.startingY,
              virtualGeometry.currentX,
              virtualGeometry.currentY
            )}
            stroke='black'
            fillEnabled={false}
          />
        </>
      );
    }
    if (virtualGeometry.gType === "polygon") {
      return (
        <RegularPolygon
          sides={5}
          stroke={"black"}
          radius={get_distance_4p(
            virtualGeometry.startingX,
            virtualGeometry.startingY,
            virtualGeometry.currentX,
            virtualGeometry.currentY
          )}
          listening={false}
          hitStrokeWidth={0}
          fillEnabled={false}
          x={virtualGeometry.startingX}
          y={virtualGeometry.startingY}
        />
      );
    }
  } else if (virtualGeometryBeingAltered) {
    /*
     dash={[10, 15]}
    augStart, augCurrent
     {selectedGeometry.map((geo) => {
          if (geo.gType === 1) {
            return (
              <Line
                x={geo.stageX}
                y={geo.stageY}
                points={[
                  geo.startingX,
                  geo.startingY,
                  geo.currentX,
                  geo.currentY,
                ]}
                closed
                stroke='black'
              />
            );
          }
          if (geo.gType === 2) {
            return (
              <Rect
                x={(geo.startingX + stageOffset.x) * stageZoomScaleInverse}
                y={(geo.startingY + stageOffset.y) * stageZoomScaleInverse}
                width={
                  -(geo.startingX - virtualGeometry.currentX) *
                  stageZoomScaleInverse
                }
                height={
                  -(geo.startingY - virtualGeometry.currentY) *
                  stageZoomScaleInverse
                }
                closed
                stroke='black'
              />
            );
          }
        })}
     */
    return (
      <>
        <Line
          points={[
            geometryAugment.start.offsetX,
            geometryAugment.start.offsetY,
            geometryAugment.current.offsetX,
            geometryAugment.current.offsetY,
          ]}
          closed
          stroke='black'
          strokeWidth={1}
          dash={[10, 15]}
        />
        <Group
          offsetX={
            geometryAugment.start.offsetX - geometryAugment.current.offsetX
          }
          offsetY={
            geometryAugment.start.offsetY - geometryAugment.current.offsetY
          }
        >
          {selectedGeometry.map((geo, i) => {
            if (geo.gType === "line") {
              return (
                <Line
                  points={[
                    geo.startingX,
                    geo.startingY,
                    geo.endingX,
                    geo.endingY,
                  ]}
                  closed
                  stroke='black'
                  key={i}
                />
              );
            }
            if (geo.gType === "rect") {
              return (
                <Rect
                  x={geo.startingX}
                  y={geo.startingY}
                  width={-(geo.startingX - geo.endingX)}
                  height={-(geo.startingY - geo.endingY)}
                  closed
                  stroke='black'
                  key={i}
                />
              );
            }
            if (geo.gType === "circle") {
              return (
                <Circle
                  x={geo.startingX}
                  y={geo.startingY}
                  radius={get_distance_4p(
                    geo.startingX,
                    geo.startingY,
                    geo.endingX,
                    geo.endingY
                  )}
                  closed
                  stroke='black'
                  key={i}
                />
              );
            }
          })}
        </Group>
      </>
    );
  }
}
