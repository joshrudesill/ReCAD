import { createSlice } from "@reduxjs/toolkit";
import {
  checkGeometryCollision,
  normalizeBoxPoints,
} from "./util/collisionDetection";

const initialState = {
  virtualGeometryBeingDrawn: false,
  virtualGeometryBeingAltered: false,
  virtualGeometry: {},
  virtualGeometryInputLocks: {
    x: false,
    y: false,
    length: { locked: false, value: 0 },
    width: { locked: false, value: 0 },
    height: { locked: false, value: 0 },
    ex: { locked: false, value: 0 },
    ey: { locked: false, value: 0 },
  },
  geometryAugment: {
    start: { offsetX: 0, offsetY: 0 },
    current: { offsetX: 0, offsetY: 0 },
    type: "none",
  },
  realGeometry: [],
  stageOffset: { x: -100, y: -800 },
  stageZoomScale: 1,
  stageZoomScaleInverse: 1,
  selectedGeometry: [],
  cursorPosition: { x: 0, y: 0 },
  cursorSnapped: false,
  showSnapPoints: false,
  selectionBox: null,
  previousStates: [],
  stateIndex: 1,
};

/* vitrual geometry 

{
  type: 'line',
  geometry: [x,y,x,y],
  ...other data
}

*/

export const drawingControlSlice = createSlice({
  name: "drawingControl",
  initialState,
  reducers: {
    // This indicates that geometry is being drawn if true, but is not yet realGeometry
    toggleVirtualDrawing: (state, action) => {
      state.virtualGeometryBeingDrawn = action.payload;
    },
    // Show the snap points which were calculated when the geometry was transistioned from virtual to real
    toggleSnapPoints: (state) => {
      state.showSnapPoints = !state.showSnapPoints;
    },
    // Cancel out of drawing, reset properly
    cancelVirtualGeometryDrawing: (state) => {
      state.virtualGeometryBeingDrawn = false;
      state.virtualGeometry = {};
      state.virtualGeometryInputLocks = initialState.virtualGeometryInputLocks;
    },

    // Setup for the start of all geometry drawin
    startDrawingVirtualGeometry: (state, action) => {
      const { startingX, startingY, gType, stageX, stageY, startingZoom } =
        action.payload;
      state.virtualGeometryBeingDrawn = true;
      state.virtualGeometry = {
        startingX: state.cursorSnapped
          ? state.cursorPosition.offsetX
          : parseFloat(startingX),
        startingY: state.cursorSnapped
          ? state.cursorPosition.offsetY
          : parseFloat(startingY),
        currentX: state.cursorSnapped
          ? state.cursorPosition.offsetX
          : parseFloat(startingX),
        currentY: state.cursorSnapped
          ? state.cursorPosition.offsetY
          : parseFloat(startingY),
        stageX: stageX,
        stageY: stageY,
        startingZoom: startingZoom,
        gType: gType,
        sides: 5,
      };
    },
    setMultiStepEnding: (state, action) => {
      state.virtualGeometry.endingX = action.payload.endingX;
      state.virtualGeometry.endingY = action.payload.endingY;
    },
    // Setup for selection box
    startSelectionBox: (state, action) => {
      const { startingX, startingY } = action.payload;
      state.selectionBox = {
        startingX: parseFloat(startingX),
        startingY: parseFloat(startingY),
        currentX: parseFloat(startingX),
        currentY: parseFloat(startingY),
      };
    },
    // Update for selection box
    updateSelectionBox: (state, action) => {
      const { x, y } = action.payload;
      state.selectionBox.currentX = parseFloat(x);
      state.selectionBox.currentY = parseFloat(y);
    },
    // Finish for selection box and cleanup, utilizes the collisionDetection module
    finishSelectionBox: (state) => {
      // check for geometry starting or ending points and select, then make sure not to check again
      // First, normalize selection box
      const normalizedPoints = normalizeBoxPoints(
        state.selectionBox.startingX,
        state.selectionBox.startingY,
        state.selectionBox.currentX,
        state.selectionBox.currentY
      );
      const keys = checkGeometryCollision(normalizedPoints, state.realGeometry);
      if (keys.length > 0) {
        state.selectedGeometry.push(
          ...state.realGeometry.filter((g) => {
            if (keys.includes(g.key)) return true;
            return false;
          })
        );
      }
      state.selectionBox = null;
    },

    updateVirtualGeometry: (state, action) => {
      if (!state.cursorSnapped) {
        const { x, y } = action.payload;
        if (state.virtualGeometryInputLocks.length.locked) {
          const fx = parseFloat(x);
          const fy = parseFloat(y);
          const angleInRadians = Math.atan2(
            fy - state.virtualGeometry.startingY,
            fx - state.virtualGeometry.startingX
          );
          const length = state.virtualGeometryInputLocks.length.value;
          state.virtualGeometry.currentX = parseFloat(
            (
              state.virtualGeometry.startingX +
              length * Math.cos(angleInRadians)
            ).toFixed(4)
          );
          state.virtualGeometry.currentY = parseFloat(
            (
              state.virtualGeometry.startingY +
              length * Math.sin(angleInRadians)
            ).toFixed(4)
          );
        } else {
          if (!state.virtualGeometryInputLocks.x) {
            state.virtualGeometry.currentX = parseFloat(x);
          }
          if (!state.virtualGeometryInputLocks.y) {
            state.virtualGeometry.currentY = parseFloat(y);
          }
          if (state.virtualGeometryInputLocks.width.locked) {
            state.virtualGeometry.currentX =
              state.virtualGeometry.startingX +
              state.virtualGeometryInputLocks.width.value;
          }
          if (state.virtualGeometryInputLocks.height.locked) {
            state.virtualGeometry.currentY =
              state.virtualGeometry.startingY +
              state.virtualGeometryInputLocks.height.value;
          }
          if (state.virtualGeometryInputLocks.ex.locked) {
            state.virtualGeometry.currentX =
              state.virtualGeometryInputLocks.ex.value;
          }
          if (state.virtualGeometryInputLocks.ey.locked) {
            state.virtualGeometry.currentY =
              state.virtualGeometryInputLocks.ey.value;
          }
        }
      }
    },
    updateVirtualGeometryWithInput: (state, action) => {
      const { typeOfUpdate, value, geoType } = action.payload;
      state.virtualGeometryBeingDrawn = true;
      state.virtualGeometry.gType = geoType;
      if (typeOfUpdate === "sx") {
        state.virtualGeometry.startingX = parseFloat(value) || 0;
      } else if (typeOfUpdate === "sy") {
        state.virtualGeometry.startingY = parseFloat(-value) || 0;
      } else if (typeOfUpdate === "ex") {
        state.virtualGeometry.currentX = parseFloat(value) || 0;
      } else if (typeOfUpdate === "ey") {
        state.virtualGeometry.currentY = parseFloat(-value) || 0;
      } else if (typeOfUpdate === "sides") {
        state.virtualGeometry.sides = parseFloat(value) || 3;
      }
    },
    updateArrayCopySides: (state, action) => {
      state.geometryAugment.copies = action.payload;
    },
    lockVirtualGeometry: (state, action) => {
      const { lockType, value } = action.payload;
      if (lockType === "x") {
        state.virtualGeometryInputLocks.x = true;
      } else if (lockType === "y") {
        state.virtualGeometryInputLocks.y = true;
      } else if (lockType === "xUnlock") {
        state.virtualGeometryInputLocks.x = false;
      } else if (lockType === "yUnlock") {
        state.virtualGeometryInputLocks.y = false;
      } else if (lockType === "length") {
        state.virtualGeometryInputLocks.length.locked = true;
        state.virtualGeometryInputLocks.length.value = parseFloat(value);
      } else if (lockType === "lengthUnlock") {
        state.virtualGeometryInputLocks.length.locked = false;
        state.virtualGeometryInputLocks.length.value = 0;
      } else if (lockType === "width") {
        state.virtualGeometryInputLocks.width.locked = true;
        state.virtualGeometryInputLocks.width.value = parseFloat(value);
      } else if (lockType === "height") {
        state.virtualGeometryInputLocks.height.locked = true;
        state.virtualGeometryInputLocks.height.value = parseFloat(value);
      } else if (lockType === "ex") {
        state.virtualGeometryInputLocks.ex.locked = true;
        state.virtualGeometryInputLocks.ex.value = parseFloat(value);
      } else if (lockType === "ey") {
        state.virtualGeometryInputLocks.ey.locked = true;
        state.virtualGeometryInputLocks.ey.value = parseFloat(value);
      }
    },
    startAugmentingVirtualGeometry: (state, action) => {
      const { offsetX, offsetY, type, copies } = action.payload;
      state.virtualGeometryBeingAltered = true;
      state.geometryAugment.type = type;
      state.geometryAugment.copies = copies;
      if (state.cursorSnapped) {
        state.geometryAugment.start = {
          offsetX: state.cursorPosition.offsetX,
          offsetY: state.cursorPosition.offsetY,
        };
      } else {
        state.geometryAugment.start = {
          offsetX: parseFloat(offsetX),
          offsetY: parseFloat(offsetY),
        };
      }
      state.geometryAugment.current = {
        offsetX: parseFloat(offsetX),
        offsetY: parseFloat(offsetY),
      };
    },
    updateVirtualGeometryAugment: (state, action) => {
      if (!state.cursorSnapped) {
        const { offsetX, offsetY } = action.payload;

        state.geometryAugment.current = {
          offsetX: parseFloat(offsetX),
          offsetY: parseFloat(offsetY),
        };
      }
    },
    endAugment: (state, action) => {
      state.virtualGeometryBeingAltered = false;

      if (state.realGeometry.length === 1) {
        if (state.geometryAugment.type === "move") {
          state.realGeometry = action.payload;
        } else if (state.geometryAugment.type === "rotate") {
          state.realGeometry = action.payload;
        }
      } else {
        if (state.geometryAugment.type === "move") {
          action.payload.forEach((g) =>
            state.realGeometry.splice(
              state.realGeometry.findIndex((e) => e.key === g.key), //find where it is
              1, //delete 1
              g //replace with new object
            )
          );
        } else if (state.geometryAugment.type === "rotate") {
          action.payload.forEach((g) =>
            state.realGeometry.splice(
              state.realGeometry.findIndex((e) => e.key === g.key), //find where it is
              1, //delete 1
              g //replace with new object
            )
          );
        }
      }
      if (state.geometryAugment.type === "copy") {
        state.realGeometry = state.realGeometry.concat(
          action.payload.map((geo, i) => {
            return { ...geo, key: state.realGeometry.length + i + 1 };
          })
        );
      } else if (state.geometryAugment.type === "array") {
        const firstIndex = state.realGeometry.at(-1).key;
        let nextIndex = firstIndex + 1;
        state.realGeometry = state.realGeometry.concat(
          action.payload.flatMap((geo, i) => {
            nextIndex += 1;
            return Array.from({
              length: state.geometryAugment.copies - 1,
            }).map((_, j) => {
              nextIndex += 1;
              return {
                ...geo,
                startingX:
                  geo.startingX +
                  (state.geometryAugment.current.offsetX -
                    state.geometryAugment.start.offsetX) *
                    j,
                startingY:
                  geo.startingY +
                  (state.geometryAugment.current.offsetY -
                    state.geometryAugment.start.offsetY) *
                    j,
                endingX:
                  geo.endingX +
                  (state.geometryAugment.current.offsetX -
                    state.geometryAugment.start.offsetX) *
                    j,
                endingY:
                  geo.endingY +
                  (state.geometryAugment.current.offsetY -
                    state.geometryAugment.start.offsetY) *
                    j,
                key: nextIndex,
                quadraticCurveAnchor: {
                  x:
                    geo.quadraticCurveAnchor?.x !== undefined
                      ? geo.quadraticCurveAnchor.x +
                        (state.geometryAugment.current.offsetX -
                          state.geometryAugment.start.offsetX) *
                          j
                      : 0,
                  y:
                    geo.quadraticCurveAnchor?.y !== undefined
                      ? geo.quadraticCurveAnchor.y +
                        (state.geometryAugment.current.offsetY -
                          state.geometryAugment.start.offsetY) *
                          j
                      : 0,
                },
              };
            });
          })
        );
      }

      if (state.stateIndex !== 1) {
        state.previousStates = [
          ...state.previousStates.slice(
            0,
            state.previousStates.length - state.stateIndex + 1
          ),
          state.realGeometry,
        ];
        state.stateIndex = 1;
      } else {
        state.previousStates.push(state.realGeometry);
      }
      // This function can be shortened significantly
      state.selectedGeometry = [];
      state.geometryAugment = initialState.geometryAugment;
    },

    deleteSelectedItems: (state) => {
      if (state.selectedGeometry.length > 0) {
        state.realGeometry = state.realGeometry.filter((geo) => {
          if (state.selectedGeometry.some((sg) => geo.key === sg.key)) {
            return false;
          }
          return true;
        });
        if (state.stateIndex !== 1) {
          state.previousStates = [
            ...state.previousStates.slice(
              0,
              state.previousStates.length - state.stateIndex + 1
            ),
            state.realGeometry,
          ];
          state.stateIndex = 1;
        } else {
          state.previousStates.push(state.realGeometry);
        }
      }
    },

    addRealGeometry: (state, action) => {
      state.virtualGeometryBeingDrawn = false;
      state.virtualGeometryInputLocks = initialState.virtualGeometryInputLocks;
      state.virtualGeometry = {};
      if (state.stateIndex !== 1) {
        // In redo state
        state.realGeometry.push({
          ...action.payload,
          key:
            state.realGeometry.length > 0
              ? state.realGeometry.at(-1).key + 1
              : 1,
        });

        state.previousStates = [
          ...state.previousStates.slice(
            0,
            state.previousStates.length - state.stateIndex + 1
          ),
          state.realGeometry,
        ];
        state.stateIndex = 1;
      } else {
        state.realGeometry.push({
          ...action.payload,
          key:
            state.realGeometry.length > 0
              ? state.realGeometry.at(-1).key + 1
              : 1,
        });
        state.previousStates.push(state.realGeometry);
      }
    },
    undoToPreviousState: (state, action) => {
      if (state.stateIndex + 1 > state.previousStates.length) {
        // Reset state
        state.realGeometry = [];
        state.stateIndex = state.previousStates.length + 1;
      } else {
        state.realGeometry = state.previousStates.at(-(state.stateIndex + 1));
        state.stateIndex += 1;
      }
    },
    redoToNextState: (state, action) => {
      if (state.stateIndex !== 1) {
        state.realGeometry = state.previousStates.at(-(state.stateIndex - 1));

        state.stateIndex -= 1;
      }
    },
    updateStageOffset: (state, action) => {
      state.stageOffset = {
        x: -action.payload.x,
        y: -action.payload.y,
      };
    },
    updateStageZoomScale: (state, action) => {
      state.stageZoomScale = action.payload;
      state.stageZoomScaleInverse = parseFloat((1 / action.payload).toFixed(6));
    },
    addSelectedGeometry: (state, action) => {
      state.selectedGeometry.push(
        state.realGeometry.find((g) => action.payload === g.key)
      );
    },
    resetSelectedGeometry: (state) => {
      state.selectedGeometry = [];
    },

    updateCursorPosition: (state, action) => {
      if (!state.cursorSnapped) {
        state.cursorPosition = action.payload;
      }
    },
    lockCursorAndSetPosition: (state, action) => {
      state.cursorSnapped = true;
      state.cursorPosition = action.payload;

      if (state.virtualGeometryBeingDrawn) {
        state.virtualGeometry.currentX = action.payload.offsetX;
        state.virtualGeometry.currentY = action.payload.offsetY;
      }
      if (state.virtualGeometryBeingAltered) {
        state.geometryAugment.current = {
          offsetX: action.payload.offsetX,
          offsetY: action.payload.offsetY,
        };
      }
    },
    unlockCursor: (state) => {
      state.cursorSnapped = false;
    },
  },
});

export const {
  toggleVirtualDrawing,
  updateVirtualGeometry,
  startDrawingVirtualGeometry,
  addRealGeometry,
  updateVirtualGeometryAugment,
  startAugmentingVirtualGeometry,
  updateStageOffset,
  updateStageZoomScale,
  resetSelectedGeometry,
  updateCursorPosition,
  addSelectedGeometry,
  endAugment,
  updateVirtualGeometryWithInput,
  lockVirtualGeometry,
  unlockCursor,
  lockCursorAndSetPosition,
  toggleSnapPoints,
  cancelVirtualGeometryDrawing,
  startSelectionBox,
  updateSelectionBox,
  finishSelectionBox,
  undoToPreviousState,
  redoToNextState,
  setMultiStepEnding,
  deleteSelectedItems,
  updateArrayCopySides,
} = drawingControlSlice.actions;

export default drawingControlSlice.reducer;
