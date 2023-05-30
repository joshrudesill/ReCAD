import { Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function VirtualGeometry() {
  const { virtualGeometryBeingDrawn, virtualGeometry, stageOffset } =
    useSelector((state) => state.drawingControl);
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === 1) {
      return (
        <Line
          x={stageOffset.x}
          y={stageOffset.y}
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
    if (virtualGeometry.gType === 2) {
      return (
        <Rect
          x={virtualGeometry.startingX + stageOffset.x}
          y={virtualGeometry.startingY + stageOffset.y}
          width={-(virtualGeometry.startingX - virtualGeometry.currentX)}
          height={-(virtualGeometry.startingY - virtualGeometry.currentY)}
          closed
          stroke='black'
        />
      );
    }
  }
}
