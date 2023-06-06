import { Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function VirtualGeometry() {
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    stageOffset,
    stageZoomScaleInverse,
    virtualGeometryBeingAltered,
  } = useSelector((state) => state.drawingControl);
  //replace^
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometryBeingAltered) {
      /*
      augStart, augCurrent
       */
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
              (virtualGeometry.startingX + stageOffset.x) *
              stageZoomScaleInverse
            }
            y={
              (virtualGeometry.startingY + stageOffset.y) *
              stageZoomScaleInverse
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
    } else {
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
              (virtualGeometry.startingX + stageOffset.x) *
              stageZoomScaleInverse
            }
            y={
              (virtualGeometry.startingY + stageOffset.y) *
              stageZoomScaleInverse
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
    }
  }
}
