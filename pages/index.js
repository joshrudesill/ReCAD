import Geometry from "@/components/geometry";
import VirtualGeometry from "@/components/virtualGeometry";
import {
  addRealGeometry,
  cancelVirtualGeometryDrawing,
  endAugment,
  finishSelectionBox,
  redoToNextState,
  resetSelectedGeometry,
  setMultiStepEnding,
  startAugmentingVirtualGeometry,
  startDrawingVirtualGeometry,
  startSelectionBox,
  toggleSnapPoints,
  undoToPreviousState,
  updateCursorPosition,
  updateSelectionBox,
  updateStageOffset,
  updateStageZoomScale,
  updateVirtualGeometry,
  updateVirtualGeometryAugment,
} from "@/features/drawingControlSlice";
import { useEffect, useRef, useState } from "react";
import {
  Arc,
  Circle,
  Ellipse,
  Layer,
  Line,
  Path,
  Rect,
  RegularPolygon,
  Ring,
  Shape,
  Stage,
  Wedge,
} from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import Konva from "konva";
import Grid from "@/components/grid";
import LineDialogue from "@/components/geometryDialogues/lineDialogue";
import CircleDialogue from "@/components/geometryDialogues/circleDialogue";
import RectDialogue from "@/components/geometryDialogues/rectDialogue";
import UserInstruction from "@/components/userInstruction/userInstruction";
import { setCurrentInstruction } from "@/features/UIControlSlice";
import BoxSelection from "@/components/boxSelection";
Konva.dragButtons = [2];
import init, { derive_actual_pos, return_jsarr } from "recad-wasm";
import ToolSelection from "@/components/toolSelection";
import PolygonDialogue from "@/components/geometryDialogues/polygonDialogue";

export default function Home() {
  const dispatch = useDispatch();

  // line - 1
  // rect - 2
  // none - 0
  const [activatedDrawingTool, setActivatedDrawingTool] = useState("none");
  const activateDrawingTool = (tool) => {
    setActivatedAugmentationTool(0);
    setActivatedDrawingTool(tool);
    setLastCommand(tool);
    setLastCommandType("d");
    const category = "drawing";

    const stage = "start";
    dispatch(setCurrentInstruction({ category, tool, stage }));
  };
  const [activatedAugmentationTool, setActivatedAugmentationTool] = useState(2);
  const activateAugmentationTool = (tool) => {
    setActivatedDrawingTool("none");
    setActivatedAugmentationTool(tool);
    setLastCommand(tool);
    setLastCommandType("a");
  };
  const [lastCommand, setLastCommand] = useState(0);
  const [lastCommandType, setLastCommandType] = useState("d");
  const {
    virtualGeometryBeingDrawn,
    virtualGeometry,
    stageOffset,
    cursorPosition,
    stageZoomScaleInverse,
    selectedGeometry,
    virtualGeometryBeingAltered,
    geometryAugment,
    selectionBox,
  } = useSelector((state) => state.drawingControl);
  useEffect(() => {
    init();
  }, []);
  const [fps, setFPS] = useState(0);

  let lastFrameTime = performance.now();
  let frameCount = 0;

  useEffect(() => {
    const updateFPS = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;

      frameCount += 1;

      if (deltaTime >= 1000) {
        setFPS((frameCount * 1000) / deltaTime);
        frameCount = 0;
        lastFrameTime = currentTime;
      }

      requestAnimationFrame(updateFPS);
    };

    updateFPS(); // Start the loop
  }, []);
  const handleClickInteractionWithStage = (e) => {
    e.evt.preventDefault();
    if (e.evt.button !== 0) {
      return;
    }
    const { offsetX, offsetY } = e.evt;
    if (activatedDrawingTool !== "none") {
      if (virtualGeometryBeingDrawn) {
        if (
          activatedDrawingTool === "curve" &&
          virtualGeometry.endingX === undefined
        ) {
          dispatch(
            setMultiStepEnding({
              endingX: virtualGeometry.currentX,
              endingY: virtualGeometry.currentY,
            })
          );
        } else {
          const geometry = {
            startingX: virtualGeometry.startingX,
            startingY: virtualGeometry.startingY,
            endingX: virtualGeometry.currentX,
            endingY: virtualGeometry.currentY,
            stageX: 0,
            stageY: 0,
            gType: virtualGeometry.gType,
            sides: virtualGeometry.sides,
          };
          if (activatedDrawingTool === "curve") {
            geometry.quadraticCurveAnchor = {
              x: virtualGeometry.currentX,
              y: virtualGeometry.currentY,
            };
            geometry.endingX = virtualGeometry.endingX;
            geometry.endingY = virtualGeometry.endingY;
          }
          setActivatedDrawingTool("none");
          dispatch(addRealGeometry(geometry));
        }
        // add real geo
      } else {
        const geometry = {
          startingX: derive_actual_pos(
            cursorPosition.offsetX,
            stageOffset.x,
            stageZoomScaleInverse
          ),
          startingY: derive_actual_pos(
            cursorPosition.offsetY,
            stageOffset.y,
            stageZoomScaleInverse
          ),

          stageX: stageOffset.x * stageZoomScaleInverse,
          stageY: stageOffset.y * stageZoomScaleInverse,
          startingZoom: stageZoomScaleInverse,
          gType: activatedDrawingTool,
        };
        dispatch(startDrawingVirtualGeometry(geometry));
        if (activatedDrawingTool === "line") {
          ldRef.current.focus("sx");
        } else if (activatedDrawingTool === "polygon") {
          ldRef.current.focus("sides");
        }
      }
    } else if (activatedAugmentationTool !== 0) {
      if (activatedAugmentationTool === 1 && selectedGeometry.length > 0) {
        if (!virtualGeometryBeingAltered) {
          dispatch(
            startAugmentingVirtualGeometry({
              offsetX: (
                (offsetX + stageOffset.x) *
                stageZoomScaleInverse
              ).toFixed(3),
              offsetY: (
                (offsetY + stageOffset.y) *
                stageZoomScaleInverse
              ).toFixed(3),
            })
          );
        } else {
          //finish
          const geometry = selectedGeometry.map((geo) => {
            return {
              ...geo,
              startingX:
                geo.startingX +
                (geometryAugment.current.offsetX -
                  geometryAugment.start.offsetX),
              startingY:
                geo.startingY +
                (geometryAugment.current.offsetY -
                  geometryAugment.start.offsetY),
              endingX:
                geo.endingX +
                (geometryAugment.current.offsetX -
                  geometryAugment.start.offsetX),
              endingY:
                geo.endingY +
                (geometryAugment.current.offsetY -
                  geometryAugment.start.offsetY),
            };
          });
          setActivatedAugmentationTool(2);

          dispatch(endAugment(geometry));
        }
      } else if (activatedAugmentationTool === 2) {
        //selection box
        if (selectionBox === null) {
          //start selection box drawing
          const selectionBox = {
            startingX: (
              (cursorPosition.offsetX + stageOffset.x) *
              stageZoomScaleInverse
            ).toFixed(4),
            startingY: (
              (cursorPosition.offsetY + stageOffset.y) *
              stageZoomScaleInverse
            ).toFixed(4),
          };
          dispatch(startSelectionBox(selectionBox));
        } else {
          dispatch(finishSelectionBox());
        }
      }
    } else {
      if (!e.evt.shiftKey) {
        dispatch(resetSelectedGeometry());
      }
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
        let oX = (offsetX + stageOffset.x) * stageZoomScaleInverse;
        let oY = (offsetY + stageOffset.y) * stageZoomScaleInverse;
        if (Math.abs(startingX - oX) < 10) {
          slope = 0;
        } else if (Math.abs(startingY - oY) < 10) {
          slope = 1000;
        } else {
          const s = (oX - startingX) / (oY - startingY);
          slope = s;
        }
        slope = Math.abs(slope);
        if (slope === 1000) {
          dispatch(updateVirtualGeometry({ x: oX, y: startingY }));
        } else if (slope === 0) {
          dispatch(updateVirtualGeometry({ x: startingX, y: oY }));
        } else if (slope > 0 && slope < 1) {
          dispatch(updateVirtualGeometry({ x: startingX, y: oY }));
        } else if (slope > 1 && slope < 1000) {
          dispatch(updateVirtualGeometry({ x: oX, y: startingY }));
        }
      } else {
        dispatch(
          updateVirtualGeometry({
            x: (offsetX + stageOffset.x) * stageZoomScaleInverse,
            y: (offsetY + stageOffset.y) * stageZoomScaleInverse,
          })
        );
      }
    } else if (virtualGeometryBeingAltered) {
      dispatch(
        updateVirtualGeometryAugment({
          offsetX: ((offsetX + stageOffset.x) * stageZoomScaleInverse).toFixed(
            0
          ),
          offsetY: ((offsetY + stageOffset.y) * stageZoomScaleInverse).toFixed(
            0
          ),
        })
      );
    } else if (selectionBox !== null) {
      dispatch(
        updateSelectionBox({
          x: (offsetX + stageOffset.x) * stageZoomScaleInverse,
          y: (offsetY + stageOffset.y) * stageZoomScaleInverse,
        })
      );
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 32) {
        // space
        if (lastCommand !== 0) {
          if (lastCommandType === "d") {
            activateDrawingTool(lastCommand);
          } else if (lastCommandType === "a") {
            activateAugmentationTool(lastCommand);
          }
        }
      } else if (e.keyCode === 27) {
        // escape
        dispatch(cancelVirtualGeometryDrawing());
        setActivatedDrawingTool(0);
        setActivatedAugmentationTool(0);
      } else if (e.keyCode === 76) {
        // L
        if (activatedDrawingTool === "none") {
          activateDrawingTool(1);
        }
      } else if (e.keyCode === 67) {
        // C
        if (activatedDrawingTool === "none") {
          activateDrawingTool(3);
        }
      } else if (e.keyCode === 82) {
        // R
        if (activatedDrawingTool === "none") {
          activateDrawingTool(2);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    lastCommand,
    lastCommandType,
    activatedDrawingTool,
    activatedAugmentationTool,
  ]);
  const ldRef = useRef(null);
  return (
    <div className='flex-row flex m-3 gap-2 '>
      <Stage
        width={1500}
        height={900}
        x={100}
        y={800}
        ref={stageRef}
        onWheel={handleWheel}
        onMouseDown={handleClickInteractionWithStage}
        onMouseMove={handleDragInteractionWithStage}
        onMouseUp={() => {
          if (selectionBox !== null) {
            dispatch(finishSelectionBox());
            setActivatedAugmentationTool(0);
          }
        }}
        onMouseLeave={() => {
          if (selectionBox !== null) {
            dispatch(finishSelectionBox());
          }
        }} // other things need to be done here
        onContextMenu={(e) => e.evt.preventDefault()}
        draggable
        dragBoundFunc={(pos) => {
          dispatch(updateStageOffset({ x: pos.x, y: pos.y }));
          return pos;
        }}
      >
        <Layer name='env' listening={false}>
          <Rect
            height={10000}
            width={10000}
            fill='#e8e8bb'
            x={-5000}
            y={-5000}
          />
          {
            //<Grid />
          }
        </Layer>
        <Layer name='realgeo'>
          <Geometry />
          <Ellipse />
        </Layer>
        <Layer name='virtualgeo' listening={false}>
          {virtualGeometryBeingDrawn || virtualGeometryBeingAltered ? (
            <VirtualGeometry />
          ) : (
            <></>
          )}
          <BoxSelection />
        </Layer>
      </Stage>
      <div className='flex gap-2 flex-col'>
        <ToolSelection
          activateDrawingTool={activateDrawingTool}
          activateAugmentationTool={activateAugmentationTool}
          length={selectedGeometry.length}
          activeDrawingTool={activatedDrawingTool}
        />
      </div>
      {activatedDrawingTool === "line" && (
        <div className='flex gap-2 flex-col'>
          <LineDialogue ref={ldRef} />
        </div>
      )}
      {activatedDrawingTool === "rect" && (
        <div className='flex gap-2 flex-col'>
          <RectDialogue ref={ldRef} />
        </div>
      )}
      {activatedDrawingTool === "circle" && (
        <div className='flex gap-2 flex-col'>
          <CircleDialogue ref={ldRef} />
        </div>
      )}
      {activatedDrawingTool === "polygon" && (
        <div className='flex gap-2 flex-col'>
          <PolygonDialogue ref={ldRef} />
        </div>
      )}
      <div className='flex gap-2 flex-col'>
        <p>
          <UserInstruction />
          {fps}
        </p>
      </div>
    </div>
  );
}
