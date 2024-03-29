import { updateArrayCopySides } from "@/features/drawingControlSlice";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const ArrayCopyDialogue = forwardRef(function ArrayCopyDialogue(props, ref) {
  const { virtualGeometry } = useSelector((state) => state.drawingControl);
  const dispatch = useDispatch();

  const sidesRef = useRef(null);
  const handleSidesChange = (e) => {
    dispatch(updateArrayCopySides(e.target.value));
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          sidesRef.current.focus();
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
        onChange={(e) => handleSidesChange(e)}
        ref={sidesRef}
      />
    </>
  );
});

export default ArrayCopyDialogue;
