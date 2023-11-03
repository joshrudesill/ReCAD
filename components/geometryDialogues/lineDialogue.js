import {
  addGeometryFields,
  updateGeometryField,
} from "@/features/UIControlSlice";
import {
  lockVirtualGeometry,
  updateVirtualGeometryWithInput,
} from "@/features/drawingControlSlice";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LineDialogue = forwardRef(function LineDialogue(_, ref) {
  const { virtualGeometry, virtualGeometryInputLocks } = useSelector(
    (state) => state.drawingControl
  );
  const dispatch = useDispatch();
  const [controlType, setControlType] = useState("start-length");
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
          fieldName: "Length",
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
        field: "Length",
        value: virtualGeometryInputLocks.length.value,
      })
    );
  }, [virtualGeometryInputLocks.length.value]);

  const updateLine = (typeOfUpdate, value, geoType) => {
    dispatch(updateVirtualGeometryWithInput({ typeOfUpdate, value, geoType }));
    if (typeOfUpdate === "x") {
      dispatch(updateGeometryField({ field: "StartingX", value }));
    }
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
      updateLine(`s${type}`, e.target.value, "line");
    } else {
      updateLine(`s${type}`, 0, "line");
    }
  };

  const handleEndPointInputChange = (e, type) => {
    if (e.target.value !== "") {
      dispatch(
        lockVirtualGeometry({ lockType: `e${type}`, value: e.target.value })
      );
      updateLine(`e${type}`, e.target.value, "line");
    } else {
      updateLine(`e${type}`, 0, "line");
    }
  };

  const sxRef = useRef(null);
  const syRef = useRef(null);
  const lengthRef = useRef(null);
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

  if (controlType === "start-length") {
    //choose starting point by clicking or typing
    //then focus length input
    //if new typing occurs, set input locks and let math be handled by updatevirtualgeo action
    return (
      <div className='opacity-0' style={{ width: "0px", height: "0px" }}>
        <input
          placeholder={`${virtualGeometry.startingX || "0"}`}
          type='number'
          onChange={(e) => handleStartPointInputChange(e, "x")}
          ref={sxRef}
          style={{ width: "0px", height: "0px" }}
        />
        <input
          placeholder={`${virtualGeometry.startingY || "0"}`}
          type='number'
          onChange={(e) => handleStartPointInputChange(e, "y")}
          ref={syRef}
          style={{ width: "0px", height: "0px" }}
        />
        <input
          placeholder={`${
            virtualGeometryInputLocks.length.locked
              ? virtualGeometryInputLocks.length.value
              : "0"
          }`}
          type='number'
          onChange={handleLengthInputChange}
          ref={lengthRef}
          style={{ width: "0px", height: "0px" }}
        />
      </div>
    );
  }

  // Probably wont be used
  if (controlType === "start-end") {
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
          placeholder={`${virtualGeometry.currentX || "0"}`}
          className='border'
          type='number'
          onChange={(e) => handleEndPointInputChange(e, "x")}
          ref={sxRef}
        />
        <input
          placeholder={`${virtualGeometry.currentY || "0"}`}
          className='border'
          type='number'
          onChange={(e) => handleEndPointInputChange(e, "y")}
          ref={syRef}
        />
      </>
    );
  }
});

export default LineDialogue;

/* if (controlType === "two-point") {
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
*/
