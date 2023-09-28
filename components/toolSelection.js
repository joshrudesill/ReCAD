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
    <div className='flex flex-row bg-gray-400'>
      <button
        className={
          activeDrawingTool === "line"
            ? `p-2 py-2 bg-green-400  hover:bg-slate-400 `
            : `  p-2 py-2 hover:bg-slate-400 `
        }
        onClick={() => activateDrawingTool("line")}
      >
        <img src='/line-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className='  p-2 py-2 hover:bg-slate-400 '
        onClick={() => activateDrawingTool("rect")}
      >
        <img src='/rect-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => activateDrawingTool("circle")}
      >
        <img src='/circle-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => activateDrawingTool("polygon")}
      >
        <img src='/polygon-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => activateDrawingTool("curve")}
      >
        <img src='/curve-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400  border-r-2 border-r-slate-500'
        onClick={() => activateDrawingTool("cap")}
      >
        <img src='/cap-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => activateAugmentationTool(1)}
        disabled={length === 0}
      >
        <img src='/move-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => activateAugmentationTool(2)}
      >
        <img src='/select-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => dispatch(toggleSnapPoints())}
      >
        <img src='/showpoints-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400 '
        onClick={() => dispatch(undoToPreviousState())}
      >
        <img src='/undo-icon.svg' alt='line' className='w-8' />
      </button>
      <button
        className=' p-2 py-2 hover:bg-slate-400  '
        onClick={() => dispatch(redoToNextState())}
      >
        <img src='/redo-icon.svg' alt='line' className='w-8' />
      </button>
    </div>
  );
}
