import {
  lockVirtualGeometry,
  updateVirtualGeometryWithInput,
} from "@/features/drawingControlSlice";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LineDialogue = forwardRef(function LineDialogue(props, ref) {
  const { virtualGeometry, virtualGeometryInputLocks } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  const [controlType, setControlType] = useState("start-length");
  const updateLine = (typeOfUpdate, value, geoType) => {
    dispatch(updateVirtualGeometryWithInput({ typeOfUpdate, value, geoType }));
  };
  const handleLengthInputChange = (e) => {
    if (e.target.value !== "") {
      dispatch(
        lockVirtualGeometry({ lockType: "length", value: e.target.value })
      );
    } else {
      dispatch(lockVirtualGeometry({ lockType: "lengthUnlock", value: 0 }));
    }
  };
  const sxRef = useRef(null);
  const syRef = useRef(null);
  const cxRef = useRef(null);
  const cyRef = useRef(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        focus(input) {
          if (input === "sx") {
            sxRef.current.focus();
          } else if (input === "sy") {
            syRef.current.focus();
          } else if (input === "cx") {
            cxRef.current.focus();
          } else if (input === "cy") {
            cyRef.current.focus();
          }
        },
      };
    },
    []
  );
  if (controlType === "two-point") {
    return (
      <>
        <input
          placeholder={`${virtualGeometry.startingX || "0"}`}
          className='border'
          type='number'
          onChange={(e) => updateLine("sx", e.target.value, 1)}
          ref={sxRef}
        />

        <input
          placeholder={`${virtualGeometry.startingY || "0"}`}
          className='border'
          type='number'
          onChange={(e) => updateLine("sy", e.target.value, 1)}
          ref={syRef}
        />
        <input
          placeholder={`${virtualGeometry.currentX || "0"}`}
          className='border'
          type='number'
          onChange={(e) => updateLine("ex", e.target.value, 1)}
          ref={cxRef}
        />
        <button
          onClick={() =>
            dispatch(lockVirtualGeometry({ lockType: "x", value: 0 }))
          }
        >
          Lock X
        </button>

        <input
          placeholder={`${virtualGeometry.currentY || "0"}`}
          className='border'
          type='number'
          onChange={(e) => updateLine("ey", e.target.value, 1)}
          ref={cyRef}
        />
        <button
          onClick={() =>
            dispatch(lockVirtualGeometry({ lockType: "y", value: 0 }))
          }
        >
          Lock Y
        </button>
      </>
    );
  }
  if (controlType === "start-length") {
    //choose starting point by clicking or typing
    //then focus length input
    //if new typing occurs, set input locks and let math be handled by updatevirtualgeo action
    return (
      <>
        <input
          placeholder={`${virtualGeometry.startingX || "0"}`}
          className='border'
          type='number'
          onChange={(e) => updateLine("sx", e.target.value, 1)}
          ref={sxRef}
        />
        <input
          placeholder={`${virtualGeometry.startingY || "0"}`}
          className='border'
          type='number'
          onChange={(e) => updateLine("sy", e.target.value, 1)}
          ref={sxRef}
        />
        <input
          placeholder={`${
            virtualGeometryInputLocks.length.locked
              ? virtualGeometryInputLocks.length.value
              : "0"
          }`}
          className='border'
          type='number'
          onChange={handleLengthInputChange}
          ref={sxRef}
        />
      </>
    );
  }
});

export default LineDialogue;
