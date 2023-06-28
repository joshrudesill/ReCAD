import {
  lockCursorAndSetPosition,
  unlockCursor,
} from "@/features/drawingControlSlice";
import { Circle } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

export default function SnapArea({ p }) {
  const dispatch = useDispatch();
  const showSnaps = useSelector((state) => state.drawingControl.showSnapPoints);
  const handleMouseEnter = (e) => {
    dispatch(
      lockCursorAndSetPosition({
        offsetX: p.x,
        offsetY: p.y,
      })
    );
  };
  const handleMouseLeave = (e) => {
    dispatch(unlockCursor());
  };
  return (
    <Circle
      radius={20}
      x={p.x}
      y={p.y}
      stroke='purple'
      strokeEnabled={showSnaps}
      fillEnabled={true}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
