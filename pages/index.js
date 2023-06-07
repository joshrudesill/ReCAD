import Geometry from "@/components/geometry";
import VirtualGeometry from "@/components/virtualGeometry";
import {
  addRealGeometry,
  resetSelectedGeometry,
  startAugmentingVirtualGeometry,
  startDrawingVirtualGeometry,
  updateCursorPosition,
  updateStageOffset,
  updateStageZoomScale,
  updateVirtualGeometry,
  updateVirtualGeometryAugment,
} from "@/features/drawingControlSlice";
import { useRef, useState } from "react";
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
  const activateDrawingTool = (tool) => {
    setActivatedAugmentationTool(0);
    setActivatedDrawingTool(tool);
  };
  const [activatedAugmentationTool, setActivatedAugmentationTool] = useState(0);
  const activateAugmentationTool = (tool) => {
    setActivatedDrawingTool(0);
    setActivatedAugmentationTool(tool);
  };
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    stageOffset,
    stageZoomScale,
    cursorPosition,
    stageZoomScaleInverse,
    selectedGeometry,
    realGeometry,
    virtualGeometryBeingAltered,
    geometryAugment,
  } = useSelector((state) => state.drawingControl);

  const handleClickInteractionWithStage = (e) => {
    e.evt.preventDefault();
    if (e.evt.button !== 0) {
      return;
    }
    const { offsetX, offsetY } = e.evt;
    if (activatedDrawingTool !== 0) {
      if (virtualGeometryBeingDrawn) {
        // add real geo
        const geometry = {
          startingX: virtualGeometry.startingX * stageZoomScaleInverse,
          startingY: virtualGeometry.startingY * stageZoomScaleInverse,
          endingX: virtualGeometry.currentX * stageZoomScaleInverse,
          endingY: virtualGeometry.currentY * stageZoomScaleInverse,
          stageX: stageOffset.x * stageZoomScaleInverse,
          stageY: stageOffset.y * stageZoomScaleInverse,
          gType: virtualGeometry.gType,
        };
        setActivatedDrawingTool(0);
        dispatch(addRealGeometry(geometry));
      } else {
        const geometry = {
          startingX: offsetX,
          startingY: offsetY,
          gType: activatedDrawingTool,
        };
        dispatch(startDrawingVirtualGeometry(geometry));
      }
    } else if (activatedAugmentationTool !== 0 && selectedGeometry.length > 0) {
      if (!virtualGeometryBeingAltered) {
        dispatch(startAugmentingVirtualGeometry({ offsetX, offsetY }));
      } else {
        //finish
      }
    } else {
      dispatch(resetSelectedGeometry());
    }
  };

  const handleDragInteractionWithStage = (e) => {
    e.evt.preventDefault();
    const { offsetX, offsetY } = e.evt;
    dispatch(updateCursorPosition({ offsetX, offsetY }));
    if (virtualGeometryBeingDrawn) {
      let slope;
      if (e.evt.shiftKey) {
        const { startingX, startingY } = virtualGeometry;
        if (Math.abs(startingX - offsetX) < 10) {
          slope = 0;
        } else if (Math.abs(startingY - offsetY) < 10) {
          slope = 1000;
        } else {
          const s = (offsetX - startingX) / (offsetY - startingY);
          slope = s;
        }
        slope = Math.abs(slope);
        if (slope === 1000) {
          dispatch(updateVirtualGeometry({ x: offsetX, y: startingY }));
        } else if (slope === 0) {
          dispatch(updateVirtualGeometry({ x: startingX, y: offsetY }));
        } else if (slope > 0 && slope < 1) {
          dispatch(updateVirtualGeometry({ x: startingX, y: offsetY }));
        } else if (slope > 1 && slope < 1000) {
          dispatch(updateVirtualGeometry({ x: offsetX, y: startingY }));
        }
      } else {
        dispatch(updateVirtualGeometry({ x: offsetX, y: offsetY }));
      }
    } else if (virtualGeometryBeingAltered) {
      dispatch(updateVirtualGeometryAugment({ offsetX, offsetY }));
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
        </Layer>
        <Layer name='realgeo'>
          <Geometry />
        </Layer>
        <Layer name='virtualgeo'>
          {virtualGeometryBeingDrawn || virtualGeometryBeingAltered ? (
            <VirtualGeometry />
          ) : (
            <></>
          )}
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
          className='px-2 py-1 bg-teal-400 ml-2'
          onClick={() => activateAugmentationTool(1)}
          disabled={selectedGeometry.length === 0}
        >
          Move
        </button>
        <button
          className='px-2 py-1 bg-slate-400 ml-2'
          onClick={() => activateDrawingTool(0)}
        >
          Clear
        </button>
        <input placeholder='x' />
        <input placeholder='y' />

        <p>vda: {virtualGeometryBeingAltered ? "t" : "f"}</p>
        <p>vdd: {virtualGeometryBeingDrawn ? "t" : "f"}</p>
        <p>vda: {JSON.stringify(geometryAugment)}</p>
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
