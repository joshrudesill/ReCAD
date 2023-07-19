import {
  addSelectedGeometry,
  lockCursorAndSetPosition,
  unlockCursor,
} from "@/features/drawingControlSlice";
import { useState } from "react";
import { Circle, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

export default function SnapArea({ p, geometry }) {
  const dispatch = useDispatch();
  const [snapAreaActive, setSnapAreaActive] = useState(false);
  const {
    showSnapPoints,
    stageZoomScaleInverse,
    virtualGeometryBeingDrawn,
    virtualGeometryBeingAltered,
  } = useSelector((state) => state.drawingControl);
  const handleMouseEnter = () => {
    dispatch(
      lockCursorAndSetPosition({
        offsetX: p.x,
        offsetY: p.y,
      })
    );
    setSnapAreaActive(true);
  };
  const handleMouseLeave = () => {
    dispatch(unlockCursor());
    setSnapAreaActive(false);
  };
  const handleClick = () => {
    if (!virtualGeometryBeingAltered && !virtualGeometryBeingDrawn) {
      dispatch(addSelectedGeometry(geometry));
    }
  };

  return (
    <>
      <Circle
        radius={20 * stageZoomScaleInverse}
        x={p.x}
        y={p.y}
        stroke='purple'
        strokeEnabled={showSnapPoints}
        fillEnabled={true}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      <Rect
        x={p.x - 0.5 * (10 * stageZoomScaleInverse)}
        y={p.y - 0.5 * (10 * stageZoomScaleInverse)}
        width={10 * stageZoomScaleInverse}
        height={10 * stageZoomScaleInverse}
        stroke='blue'
        strokeWidth={0.8 * stageZoomScaleInverse}
        strokeEnabled={snapAreaActive}
        listening={false}
      />
    </>
  );
}