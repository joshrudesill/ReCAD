import Geometry from "@/components/geometry";
import VirtualGeometry from "@/components/virtualGeometry";
import {
  addRealGeometry,
  resetSelectedGeometry,
  startDrawingVirtualGeometry,
  updateCursorPosition,
  updateStageOffset,
  updateStageZoomScale,
  updateVirtualGeometry,
} from "@/features/drawingControlSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import Konva from "konva";
import Grid from "@/components/grid";
import CustomCursor from "@/components/customCursor";
Konva.dragButtons = [2];
export default function Home() {
  const dispatch = useDispatch();

  // line - 1
  // rect - 2
  // none - 0
  const [activatedDrawingTool, setActivatedDrawingTool] = useState(0);
  const activateDrawingTool = (tool) => setActivatedDrawingTool(tool);
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    stageOffset,
    stageZoomScale,
    cursorPosition,
  } = useSelector((state) => state.drawingControl);

  const handleClickInteractionWithStage = (e) => {
    e.evt.preventDefault();
    if (e.evt.button !== 0) {
      return;
    }
    const { x, y } = e.evt;
    if (activatedDrawingTool !== 0) {
      if (virtualGeometryBeingDrawn) {
        // add real geo
        const geometry = {
          startingX: virtualGeometry.startingX * (1 / stageZoomScale),
          startingY: virtualGeometry.startingY * (1 / stageZoomScale),
          endingX: virtualGeometry.currentX * (1 / stageZoomScale),
          endingY: virtualGeometry.currentY * (1 / stageZoomScale),
          stageX: stageOffset.x * (1 / stageZoomScale),
          stageY: stageOffset.y * (1 / stageZoomScale),
          gType: virtualGeometry.gType,
        };
        setActivatedDrawingTool(0);
        dispatch(addRealGeometry(geometry));
      } else {
        const geometry = {
          startingX: x,
          startingY: y,
          gType: activatedDrawingTool,
        };
        dispatch(startDrawingVirtualGeometry(geometry));
      }
    } else {
      dispatch(resetSelectedGeometry());
    }
  };

  const handleDragInteractionWithStage = (e) => {
    e.evt.preventDefault();
    const { x, y } = e.evt;
    dispatch(updateCursorPosition({ x, y }));
    if (virtualGeometryBeingDrawn) {
      let slope;
      if (e.evt.shiftKey) {
        const { startingX, startingY } = virtualGeometry;
        if (Math.abs(startingX - x) < 10) {
          slope = 0;
        } else if (Math.abs(startingY - y) < 10) {
          slope = 1000;
        } else {
          const s = (x - startingX) / (y - startingY);
          slope = s;
        }
        slope = Math.abs(slope);
        if (slope === 1000) {
          dispatch(updateVirtualGeometry({ x: x, y: startingY }));
        } else if (slope === 0) {
          dispatch(updateVirtualGeometry({ x: startingX, y: y }));
        } else if (slope > 0 && slope < 1) {
          dispatch(updateVirtualGeometry({ x: startingX, y: y }));
        } else if (slope > 1 && slope < 1000) {
          dispatch(updateVirtualGeometry({ x: x, y: startingY }));
        }
      } else {
        dispatch(updateVirtualGeometry({ x: x, y: y }));
      }
    }
  };
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [o, setO] = useState(0);
  const [z, setZ] = useState("n");

  const stageRef = useRef(null);

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stage.scaleX();

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const minScale = 0.1;
    const maxScale = 10;
    const scale = Math.max(minScale, Math.min(maxScale, newScale));

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * scale,
      y: pointer.y - mousePointTo.y * scale,
    };
    dispatch(updateStageZoomScale(scale));

    dispatch(updateStageOffset(newPos));
    stage.scale({ x: scale, y: scale });
    stage.position(newPos);
  };
  return (
    <div className='flex-row flex m-3 gap-2'>
      <Stage
        width={1500}
        height={900}
        className='cursor-none'
        x={100}
        y={800}
        ref={stageRef}
        onWheel={handleWheel}
        onMouseDown={handleClickInteractionWithStage}
        onMouseMove={handleDragInteractionWithStage}
        onContextMenu={(e) => e.evt.preventDefault()}
        draggable={!virtualGeometryBeingDrawn}
        dragBoundFunc={(pos) => {
          dispatch(updateStageOffset({ x: pos.x, y: pos.y }));
          return pos;
        }}
      >
        <Layer name='env'>
          <Rect height={10000} width={10000} fill='grey' x={-5000} y={-5000} />
          <Grid />
          <CustomCursor mouse={mouse} />
        </Layer>
        <Layer name='realgeo'>
          <Geometry />
        </Layer>
        <Layer name='virtualgeo'>
          {virtualGeometryBeingDrawn && <VirtualGeometry />}
        </Layer>
      </Stage>
      <div className='flex gap-2 flex-col'>
        <button
          className='px-2 py-1 bg-slate-400 ml-2'
          onClick={() => activateDrawingTool(1)}
        >
          Line
        </button>
        <button
          className='px-2 py-1 bg-slate-400 ml-2'
          onClick={() => activateDrawingTool(2)}
        >
          Rect
        </button>
        <button
          className='px-2 py-1 bg-slate-400 ml-2'
          onClick={() => activateDrawingTool(0)}
        >
          Clear
        </button>
        <input placeholder='x' />
        <input placeholder='y' />

        <p>m: {JSON.stringify(cursorPosition)}</p>
        <p>slope: {JSON.stringify(o)}</p>
        <p>z: {JSON.stringify(z)}</p>
      </div>
    </div>
  );
}
/**<p>Tool: {activatedDrawingTool}</p>
 <p>Geo: {JSON.stringify(realGeometry)}</p>
 <p>Geo: {JSON.stringify(stageOffset)}</p>
        <p>VD: {JSON.stringify(virtualGeometryBeingDrawn)}</p>
        <p>VD: {JSON.stringify(virtualGeometry)}</p>
 * 
 */
