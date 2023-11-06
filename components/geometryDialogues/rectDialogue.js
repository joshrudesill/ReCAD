import {
  addGeometryFields,
  updateGeometryField,
} from "@/features/UIControlSlice";
import {
  lockVirtualGeometry,
  updateVirtualGeometryWithInput,
} from "@/features/drawingControlSlice";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const { log } = console;
const RectDialogue = forwardRef(function RectDialogue(_, ref) {
  const { virtualGeometry, virtualGeometryInputLocks } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  const [controlType, setControlType] = useState("start-lw");

  useEffect(() => {
    dispatch(
      addGeometryFields([
        {
          fieldName: "Starting X",
          fieldValue: virtualGeometry?.startingX || 0,
          defaultValue: 0,
        },
        {
          fieldName: "Starting Y",
          fieldValue: -virtualGeometry?.startingY || 0,
          defaultValue: 0,
        },
        {
          fieldName: "Width",
          fieldValue: virtualGeometryInputLocks?.length?.value || "Not set",
          defaultValue: "Not set",
        },
        {
          fieldName: "Height",
          fieldValue: virtualGeometryInputLocks?.length?.value || "Not set",
          defaultValue: "Not set",
        },
      ])
    );
  }, []);
  useEffect(() => {
    if (virtualGeometry.startingX) {
      dispatch(
        updateGeometryField({
          field: "Starting X",
          value: virtualGeometry.startingX,
        })
      );
    }
  }, [virtualGeometry.startingX]);
  useEffect(() => {
    if (virtualGeometry.startingY) {
      dispatch(
        updateGeometryField({
          field: "Starting Y",
          value: -virtualGeometry.startingY,
        })
      );
    }
  }, [virtualGeometry.startingY]);
  useEffect(() => {
    dispatch(
      updateGeometryField({
        field: "Width",
        value: virtualGeometryInputLocks.width.value,
      })
    );
  }, [virtualGeometryInputLocks.width.value]);
  useEffect(() => {
    dispatch(
      updateGeometryField({
        field: "Height",
        value: virtualGeometryInputLocks.height.value,
      })
    );
  }, [virtualGeometryInputLocks.height.value]);

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
      updateLine(`${type}`, e.target.value, "rect");
    } else {
      updateLine(`${type}`, 0, "rect");
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
          } else if (input === "width") {
            lengthRef.current.focus();
          } else if (input === "height") {
            heightRef.current.focus();
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
      <div className='opacity-0'>
        <input
          placeholder={`${virtualGeometry.startingX || "0"}`}
          className='border'
          type='number'
          onChange={(e) => handleStartPointInputChange(e, "sx")}
          ref={sxRef}
        />
        <input
          placeholder={`${virtualGeometry.startingY || "0"}`}
          className='border'
          type='number'
          onChange={(e) => handleStartPointInputChange(e, "sy")}
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
      </div>
    );
  }
});

export default RectDialogue;
