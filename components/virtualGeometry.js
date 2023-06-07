import { Group, Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function VirtualGeometry() {
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    stageOffset,
    stageZoomScaleInverse,
    stageZoomScale,
    selectedGeometry,
    virtualGeometryBeingAltered,
    geometryAugment,
  } = useSelector((state) => state.drawingControl);
  //replace^
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === 1) {
      return (
        <Line
          x={stageOffset.x * stageZoomScaleInverse}
          y={stageOffset.y * stageZoomScaleInverse}
          points={[
            virtualGeometry.startingX * stageZoomScaleInverse,
            virtualGeometry.startingY * stageZoomScaleInverse,
            virtualGeometry.currentX * stageZoomScaleInverse,
            virtualGeometry.currentY * stageZoomScaleInverse,
          ]}
          closed
          stroke='black'
        />
      );
    }
    if (virtualGeometry.gType === 2) {
      return (
        <Rect
          x={
            (virtualGeometry.startingX + stageOffset.x) * stageZoomScaleInverse
          }
          y={
            (virtualGeometry.startingY + stageOffset.y) * stageZoomScaleInverse
          }
          width={
            -(virtualGeometry.startingX - virtualGeometry.currentX) *
            stageZoomScaleInverse
          }
          height={
            -(virtualGeometry.startingY - virtualGeometry.currentY) *
            stageZoomScaleInverse
          }
          closed
          stroke='black'
        />
      );
    }
  } else if (virtualGeometryBeingAltered) {
    /*
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
          x={stageOffset.x * stageZoomScaleInverse}
          y={stageOffset.y * stageZoomScaleInverse}
          points={[
            geometryAugment.start.offsetX * stageZoomScaleInverse,
            geometryAugment.start.offsetY * stageZoomScaleInverse,
            geometryAugment.current.offsetX * stageZoomScaleInverse,
            geometryAugment.current.offsetY * stageZoomScaleInverse,
          ]}
          closed
          stroke='black'
          strokeWidth='0.5'
          dash={[10, 15]}
        />
        <Group
          offsetX={
            (geometryAugment.start.offsetX - geometryAugment.current.offsetX) *
            stageZoomScaleInverse
          }
          offsetY={
            (geometryAugment.start.offsetY - geometryAugment.current.offsetY) *
            stageZoomScaleInverse
          }
        >
          {selectedGeometry.map((geo) => {
            if (geo.gType === 1) {
              return (
                <Line
                  x={geo.stageX}
                  y={geo.stageY}
                  points={[
                    geo.startingX,
                    geo.startingY,
                    geo.endingX,
                    geo.endingY,
                  ]}
                  closed
                  stroke='black'
                />
              );
            }
            if (geo.gType === 2) {
              return (
                <Rect
                  x={geo.stageX}
                  y={geo.stageY}
                  width={-(geo.startingX - geo.endingX)}
                  height={-(geo.startingY - geo.endingY)}
                  closed
                  stroke='black'
                />
              );
            }
          })}
        </Group>
      </>
    );
  }
}
