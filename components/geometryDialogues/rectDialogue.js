import {
  lockVirtualGeometry,
  updateVirtualGeometryWithInput,
} from "@/features/drawingControlSlice";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RectDialogue = forwardRef(function RectDialogue(props, ref) {
  const { virtualGeometry, virtualGeometryInputLocks } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  const [controlType, setControlType] = useState("start-lw");
  const updateLine = (typeOfUpdate, value, geoType) => {
    dispatch(updateVirtualGeometryWithInput({ typeOfUpdate, value, geoType }));
  };
  const handleWHInputChange = (e, wh) => {
    if (e.target.value !== "") {
      dispatch(lockVirtualGeometry({ lockType: wh, value: e.target.value }));
    } else {
      dispatch(lockVirtualGeometry({ lockType: "wUnlock", value: 0 }));
    }
  };
  const handleStartPointInputChange = (e, type) => {
    if (e.target.value !== "") {
      updateLine(`s${type}`, e.target.value, 3);
    } else {
      updateLine(`s${type}`, 0, 3);
    }
  };
  const sxRef = useRef(null);
  const syRef = useRef(null);
  const lengthRef = useRef(null);
  const heightRef = useRef(null);
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
          }
        },
      };
    },
    []
  );

  if (controlType === "start-lw") {
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
          onChange={(e) => handleWHInputChange(e, "width")}
          ref={lengthRef}
        />
        <input
          placeholder={`${
            virtualGeometryInputLocks.length.locked
              ? virtualGeometryInputLocks.length.value
              : "0"
          }`}
          className='border'
          type='number'
          onChange={(e) => handleWHInputChange(e, "height")}
          ref={heightRef}
        />
      </>
    );
  }
});

export default RectDialogue;
