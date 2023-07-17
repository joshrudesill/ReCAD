import { useDispatch } from "react-redux";
import {
  redoToNextState,
  toggleSnapPoints,
  undoToPreviousState,
} from "@/features/drawingControlSlice";
export default function ToolSelection({
  activateDrawingTool,
  length,
  activateAugmentationTool,
  activeDrawingTool,
}) {
  const dispatch = useDispatch();
  return (
    <>
      <button
        className={
          activeDrawingTool === "line"
            ? `px-2 py-1 bg-green-400 ml-2 hover:bg-orange-500 rounded-md`
            : `px-2 py-1 bg-slate-400 ml-2 hover:bg-orange-500 rounded-md`
        }
        onClick={() => activateDrawingTool("line")}
      >
        Line
      </button>
      <button
        className='px-2 py-1 bg-slate-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateDrawingTool("rect")}
      >
        Rect
      </button>
      <button
        className='px-2 py-1 bg-slate-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateDrawingTool("circle")}
      >
        Circle
      </button>
      <button
        className='px-2 py-1 bg-slate-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateDrawingTool("polygon")}
      >
        Polygon
      </button>
      <button
        className='px-2 py-1 bg-red-400 ml-2 hover:bg-orange-500 disabled:bg-slate-500 rounded-md'
        onClick={() => activateAugmentationTool(1)}
        disabled={length === 0}
      >
        Move
      </button>
      <button
        className='px-2 py-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateAugmentationTool(2)}
      >
        Select
      </button>
      <button
        className='px-2 py-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => dispatch(toggleSnapPoints())}
      >
        Show Points
      </button>
      <button
        className='px-2 py-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => dispatch(undoToPreviousState())}
      >
        Undo
      </button>
      <button
        className='px-2 py-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => dispatch(redoToNextState())}
      >
        Redo
      </button>
    </>
  );
}
