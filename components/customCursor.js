import { Rect, Circle, Group, Line } from "react-konva";
import { useSelector } from "react-redux";

export default function CustomCursor() {
  const { cursorPosition, stageOffset, stageZoomScale } = useSelector(
    (state) => state.drawingControl
  );
  return (
    <Group>
      <Circle
        x={(cursorPosition.x + stageOffset.x - 11) * (1 / stageZoomScale)}
        y={(cursorPosition.y + stageOffset.y - 11) * (1 / stageZoomScale)}
        radius={4}
        stroke='red'
        hitStrokeWidth={0}
        strokeWidth={0.8}
        listening={false}
        scale={{ x: 1 / stageZoomScale, y: 1 / stageZoomScale }}
      />
      <Line
        x={(cursorPosition.x + stageOffset.x - 11) * (1 / stageZoomScale)}
        y={(cursorPosition.y + stageOffset.y - 11) * (1 / stageZoomScale)}
        points={[0, 7, 0, 30]}
        closed
        stroke='black'
        strokeWidth={1}
        hitStrokeWidth={0}
        listening={false}
        perfectDrawEnabled={false}
        scale={{ x: 1 / stageZoomScale, y: 1 / stageZoomScale }}
      />
      <Line
        x={(cursorPosition.x + stageOffset.x - 11) * (1 / stageZoomScale)}
        y={(cursorPosition.y + stageOffset.y - 11) * (1 / stageZoomScale)}
        points={[0, -7, 0, -30]}
        closed
        stroke='black'
        strokeWidth={1}
        hitStrokeWidth={0}
        listening={false}
        perfectDrawEnabled={false}
        scale={{ x: 1 / stageZoomScale, y: 1 / stageZoomScale }}
      />
      <Line
        x={(cursorPosition.x + stageOffset.x - 11) * (1 / stageZoomScale)}
        y={(cursorPosition.y + stageOffset.y - 11) * (1 / stageZoomScale)}
        points={[7, 0, 30, 0]}
        closed
        stroke='black'
        strokeWidth={1}
        hitStrokeWidth={0}
        listening={false}
        perfectDrawEnabled={false}
        scale={{ x: 1 / stageZoomScale, y: 1 / stageZoomScale }}
      />
      <Line
        x={(cursorPosition.x + stageOffset.x - 11) * (1 / stageZoomScale)}
        y={(cursorPosition.y + stageOffset.y - 11) * (1 / stageZoomScale)}
        points={[-7, 0, -30, 0]}
        closed
        stroke='black'
        strokeWidth={1}
        hitStrokeWidth={0}
        listening={false}
        perfectDrawEnabled={false}
        scale={{ x: 1 / stageZoomScale, y: 1 / stageZoomScale }}
      />
    </Group>
  );
}
