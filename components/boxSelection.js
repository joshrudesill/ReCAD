import { Rect } from "react-konva";
import { useSelector } from "react-redux";

export default function BoxSelection() {
  const { selectionBox } = useSelector((state) => state.drawingControl);
  return (
    selectionBox && (
      <Rect
        x={selectionBox.startingX}
        y={selectionBox.startingY}
        width={-(selectionBox.startingX - selectionBox.currentX)}
        height={-(selectionBox.startingY - selectionBox.currentY)}
        stroke='orange'
        dash={[10, 15]}
      />
    )
  );
}
