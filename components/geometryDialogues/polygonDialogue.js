import {
  lockVirtualGeometry,
  updateVirtualGeometryWithInput,
} from "@/features/drawingControlSlice";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PolygonDialogue = forwardRef(function PolygonDialogue(props, ref) {
  const { virtualGeometry, virtualGeometryInputLocks } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  const [controlType, setControlType] = useState("start-radius");
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
  const handleStartPointInputChange = (e, type) => {
    if (e.target.value !== "") {
      updateLine(`s${type}`, e.target.value, "polygon");
    } else {
      updateLine(`s${type}`, 0, "polygon");
    }
  };
  const handleSideInputChange = (e, type) => {
    if (e.target.value !== "") {
      updateLine("sides", e.target.value, "polygon");
    } else {
      updateLine("sides", 0, "polygon");
    }
  };
  const sxRef = useRef(null);
  const syRef = useRef(null);
  const lengthRef = useRef(null);
  const sidesRef = useRef(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        focus(input) {
          if (input === "sx") {
            sxRef.current.focus();
          } else if (input === "sy") {
            syRef.current.focus();
          } else if (input === "length") {
            lengthRef.current.focus();
          } else if (input === "sides") {
            sidesRef.current.focus();
          }
        },
      };
    },
    []
  );

  if (controlType === "start-radius") {
    //choose starting point by clicking or typing
    //then focus length input
    //if new typing occurs, set input locks and let math be handled by updatevirtualgeo action
    return (
      <>
        <input
          placeholder={`${virtualGeometry.startingX || "0"}`}
          className='border'
          type='number'
          onChange={(e) => handleStartPointInputChange(e, "x")}
          ref={sxRef}
        />
        <input
          placeholder={`${virtualGeometry.startingY || "0"}`}
          className='border'
          type='number'
          onChange={(e) => handleStartPointInputChange(e, "y")}
          ref={syRef}
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
          ref={lengthRef}
        />
        <input
          placeholder={`${virtualGeometry.sides || "5"}`}
          className='border'
          type='number'
          onChange={handleSideInputChange}
          ref={sidesRef}
        />
      </>
    );
  }
});

export default PolygonDialogue;
