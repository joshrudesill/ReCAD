import { Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function VirtualGeometry() {
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    stageOffset,
    stageZoomScale,
  } = useSelector((state) => state.drawingControl);
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === 1) {
      return (
        <Line
          x={stageOffset.x * (1 / stageZoomScale)}
          y={stageOffset.y * (1 / stageZoomScale)}
          points={[
            virtualGeometry.startingX * (1 / stageZoomScale),
            virtualGeometry.startingY * (1 / stageZoomScale),
            virtualGeometry.currentX * (1 / stageZoomScale),
            virtualGeometry.currentY * (1 / stageZoomScale),
          ]}
          closed
          stroke='black'
        />
      );
    }
    if (virtualGeometry.gType === 2) {
      return (
        <Rect
          x={(virtualGeometry.startingX + stageOffset.x) * (1 / stageZoomScale)}
          y={(virtualGeometry.startingY + stageOffset.y) * (1 / stageZoomScale)}
          width={
            -(virtualGeometry.startingX - virtualGeometry.currentX) *
            (1 / stageZoomScale)
          }
          height={
            -(virtualGeometry.startingY - virtualGeometry.currentY) *
            (1 / stageZoomScale)
          }
          closed
          stroke='black'
        />
      );
    }
  }
}
