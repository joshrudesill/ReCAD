import {
  lockVirtualGeometry,
  updateVirtualGeometryWithInput,
} from "@/features/drawingControlSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LineDialogue() {
  const { virtualGeometry, virtualGeometryBeingDrawn } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  const [controlType, setControlType] = useState("two-point");
  const updateLine = (typeOfUpdate, value) => {
    dispatch(updateVirtualGeometryWithInput({ typeOfUpdate, value }));
  };
  if (controlType === "two-point") {
    return (
      <>
        <input
          placeholder={`${virtualGeometry.startingX || "Starting X"}`}
          className='border'
          value={virtualGeometry.startingX || 0}
          type='number'
          onChange={(e) => updateLine("sx", e.target.value)}
          disabled={!virtualGeometryBeingDrawn}
        />

        <input
          placeholder={`${virtualGeometry.startingY || "Starting Y"}`}
          className='border'
          value={-virtualGeometry.startingY || 0}
          type='number'
          disabled={!virtualGeometryBeingDrawn}
          onChange={(e) => updateLine("sy", e.target.value)}
        />
        <input
          placeholder={`${virtualGeometry.currentX || "Starting X"}`}
          className='border'
          value={virtualGeometry.currentX || 0}
          type='number'
          disabled={!virtualGeometryBeingDrawn}
          onChange={(e) => updateLine("ex", e.target.value)}
        />
        <button onClick={() => dispatch(lockVirtualGeometry("x"))}>
          Lock X
        </button>

        <input
          placeholder={`${virtualGeometry.currentY || "Starting Y"}`}
          className='border'
          value={-virtualGeometry.currentY || 0}
          type='number'
          disabled={!virtualGeometryBeingDrawn}
          onChange={(e) => updateLine("ey", e.target.value)}
        />
        <button onClick={() => dispatch(lockVirtualGeometry("y"))}>
          Lock Y
        </button>
      </>
    );
  }
}
