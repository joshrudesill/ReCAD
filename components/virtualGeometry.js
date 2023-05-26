import { useDispatch, useSelector } from "react-redux";

export default function VirtualGeometry() {
  const dispatch = useDispatch();
  const virtualGeometryPresent = useSelector(
    (state) => state.drawingControl.virtualGeometryBeingDrawn
  );
  return <div></div>;
}
