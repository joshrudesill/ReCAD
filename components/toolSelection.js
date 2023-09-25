import { useDispatch } from "react-redux";
import {
  redoToNextState,
  toggleSnapPoints,
  undoToPreviousState,
} from "@/features/drawingControlSlice";
import Image from "next/image";
export default function ToolSelection({
  activateDrawingTool,
  length,
  activateAugmentationTool,
  activeDrawingTool,
}) {
  const dispatch = useDispatch();
  return (
    <div className='p-3 bg-amber-300'>
      <button
        className={
          activeDrawingTool === "line"
            ? `p-1 bg-green-400 ml-2 hover:bg-orange-500 rounded-md`
            : `p-0.5 bg-slate-300 ml-2 hover:bg-orange-500 rounded-md border-2 border-slate-500`
        }
        onClick={() => activateDrawingTool("line")}
      >
        <img src='/line-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-0.5 bg-slate-300 ml-2 hover:bg-orange-500 rounded-md border-2 border-slate-500'
        onClick={() => activateDrawingTool("rect")}
      >
        <img src='/rect-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className='p-0.5 bg-slate-300 ml-2 hover:bg-orange-500 rounded-md border-2 border-slate-500'
        onClick={() => activateDrawingTool("circle")}
      >
        <img src='/circle-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className='p-0.5 bg-slate-300 ml-2 hover:bg-orange-500 rounded-md border-2 border-slate-500'
        onClick={() => activateDrawingTool("polygon")}
      >
        <img src='/polygon-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className='p-1 bg-slate-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateDrawingTool("curve")}
      >
        Curve
      </button>
      <button
        className='p-1 bg-slate-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateDrawingTool("cap")}
      >
        Cap
      </button>
      <button
        className='p-1 bg-red-400 ml-2 hover:bg-orange-500 disabled:bg-slate-500 rounded-md'
        onClick={() => activateAugmentationTool(1)}
        disabled={length === 0}
      >
        Move
      </button>
      <button
        className='p-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => activateAugmentationTool(2)}
      >
        Select
      </button>
      <button
        className='p-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => dispatch(toggleSnapPoints())}
      >
        Show Points
      </button>
      <button
        className='p-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => dispatch(undoToPreviousState())}
      >
        Undo
      </button>
      <button
        className='p-1 bg-teal-400 ml-2 hover:bg-orange-500 rounded-md'
        onClick={() => dispatch(redoToNextState())}
      >
        Redo
      </button>
    </div>
  );
}
