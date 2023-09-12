import {
  lockAugmentAngle,
  updateArrayCopySides,
} from "@/features/drawingControlSlice";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const RotationDialogue = forwardRef(function RotationDialogue(props, ref) {
  const { virtualGeometry } = useSelector((state) => state.drawingControl);
  const dispatch = useDispatch();

  const rotationAngleRef = useRef(null);
  const handleRotationChange = (e) => {
    dispatch(lockAugmentAngle(e.target.value));
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          rotationAngleRef.current.focus();
        },
      };
    },
    []
  );

  return (
    <>
      <input
        placeholder={`${virtualGeometry.startingX || "0"}`}
        className='border'
        type='number'
        onChange={(e) => handleRotationChange(e)}
        ref={rotationAngleRef}
      />
    </>
  );
});

export default RotationDialogue;
