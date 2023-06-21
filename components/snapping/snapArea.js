import {
  lockCursorAndSetPosition,
  unlockCursor,
} from "@/features/drawingControlSlice";
import { Circle } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

export default function SnapArea({ p }) {
  const dispatch = useDispatch();
  const { stageOffset, stageZoomScaleInverse } = useSelector(
    (state) => state.drawingControl
  );
  const handleMouseEnter = (e) => {
    console.log("enter");
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
      stroke='purple'
      x={p.x}
      y={p.y}
      fillEnabled={true}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
