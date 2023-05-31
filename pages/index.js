import Geometry from "@/components/geometry";
import VirtualGeometry from "@/components/virtualGeometry";
import {
  addRealGeometry,
  startDrawingVirtualGeometry,
  updateStageOffset,
  updateVirtualGeometry,
} from "@/features/drawingControlSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import Konva from "konva";
Konva.dragButtons = [2];
export default function Home() {
  const dispatch = useDispatch();

  // line - 1
  // rect - 2
  // none - 0
  const [activatedDrawingTool, setActivatedDrawingTool] = useState(0);
  const activateDrawingTool = (tool) => setActivatedDrawingTool(tool);
  const { virtualGeometryBeingDrawn, virtualGeometry, stageOffset } =
    useSelector((state) => state.drawingControl);

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
          startingX: virtualGeometry.startingX,
          startingY: virtualGeometry.startingY,
          endingX: virtualGeometry.currentX,
          endingY: virtualGeometry.currentY,
          stageX: stageOffset.x,
          stageY: stageOffset.y,
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
    }
  };

  const handleDragInteractionWithStage = (e) => {
    e.evt.preventDefault();
    if (virtualGeometryBeingDrawn) {
      const { x, y } = e.evt;
      dispatch(updateVirtualGeometry({ x: x, y: y }));
    }
  };
  const [zoom, setZoom] = useState(1);
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

    stage.scale({ x: scale, y: scale });
    stage.position(newPos);
  };
  return (
    <>
      <Stage
        width={1000}
        height={1000}
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
        <Layer name='realgeo'>
          <Rect height={10000} width={10000} fill='grey' />
          <Geometry />
        </Layer>
        <Layer name='virtualgeo'>
          {virtualGeometryBeingDrawn && <VirtualGeometry />}
        </Layer>
      </Stage>
      <div className='flex gap-2'>
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
        <button
          className='px-2 py-1 bg-slate-400 ml-2'
          onClick={() => setZoom(zoom + 0.1)}
        >
          zoom
        </button>
        <button
          className='px-2 py-1 bg-slate-400 ml-2'
          onClick={() => setZoom(zoom - 0.1)}
        >
          zoom-
        </button>
        <p>Geo: {JSON.stringify(stageOffset)}</p>
      </div>
    </>
  );
}
/**<p>Tool: {activatedDrawingTool}</p>
        <p>Geo: {JSON.stringify(realGeometry)}</p>
        <p>VD: {JSON.stringify(virtualGeometryBeingDrawn)}</p>
        <p>VD: {JSON.stringify(virtualGeometry)}</p>
 * 
 */
