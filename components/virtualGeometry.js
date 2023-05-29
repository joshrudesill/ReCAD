import { Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function VirtualGeometry() {
  const { virtualGeometryBeingDrawn, virtualGeometry } = useSelector(
    (state) => state.drawingControl
  );
  if (virtualGeometryBeingDrawn) {
    if (virtualGeometry.gType === 1) {
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
    if (virtualGeometry.gType === 2) {
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
  }
}
