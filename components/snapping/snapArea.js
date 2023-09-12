import {
  addSelectedGeometry,
  lockCursorAndSetPosition,
  unlockCursor,
} from "@/features/drawingControlSlice";
import { useState } from "react";
import { Circle, Rect } from "react-konva";

export default function SnapArea({
  px,
  py,
  dispatch,
  stageZoomScaleInverse,
  showSnapPoints,
  enableSnaps,
}) {
  const [snapAreaActive, setSnapAreaActive] = useState(false);

  const handleMouseEnter = () => {
    dispatch(
      lockCursorAndSetPosition({
        offsetX: px,
        offsetY: py,
      })
    );
    setSnapAreaActive(true);
  };
  const handleMouseLeave = () => {
    dispatch(unlockCursor());
    setSnapAreaActive(false);
  };

  return (
    <>
      <Circle
        radius={10 * stageZoomScaleInverse}
        x={px}
        y={py}
        stroke='purple'
        strokeEnabled={showSnapPoints}
        fillEnabled={enableSnaps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Rect
        x={px - 0.5 * (10 * stageZoomScaleInverse)}
        y={py - 0.5 * (10 * stageZoomScaleInverse)}
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
