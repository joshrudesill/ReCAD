import { createSlice } from "@reduxjs/toolkit";
import {
  checkGeometryStartingPoints,
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
  },
  geometryAugment: { start: { x: 0, y: 0 }, current: { x: 0, y: 0 } },
  realGeometry: [],
  stageOffset: { x: -100, y: -800 },
  stageZoomScale: 1,
  stageZoomScaleInverse: 1,
  selectedGeometry: [],
  cursorPosition: { x: 0, y: 0 },
  cursorSnapped: false,
  showSnapPoints: false,
  selectionBox: null,
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
    toggleVirtualDrawing: (state, action) => {
      state.virtualGeometryBeingDrawn = action.payload;
    },
    toggleSnapPoints: (state) => {
      state.showSnapPoints = !state.showSnapPoints;
    },
    cancelVirtualGeometryDrawing: (state) => {
      state.virtualGeometryBeingDrawn = false;
      state.virtualGeometry = {};
      state.virtualGeometryInputLocks = initialState.virtualGeometryInputLocks;
    },
    /**
     * Sets virtualGeometryBeingDrawn top true and starts virtualGeometry
     * @param {object} action Pass in starting X, Y, and type of geometry.
     */

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
      };
    },
    startSelectionBox: (state, action) => {
      const { startingX, startingY } = action.payload;
      state.selectionBox = {
        startingX: parseFloat(startingX),
        startingY: parseFloat(startingY),
        currentX: parseFloat(startingX),
        currentY: parseFloat(startingY),
      };
    },
    updateSelectionBox: (state, action) => {
      const { x, y } = action.payload;
      state.selectionBox.currentX = parseFloat(x);
      state.selectionBox.currentY = parseFloat(y);
    },
    finishSelectionBox: (state) => {
      // check for geometry starting or ending points and select, then make sure not to check again
      // First, normalize selection box
      const normalizedPoints = normalizeBoxPoints(
        state.selectionBox.startingX,
        state.selectionBox.startingY,
        state.selectionBox.currentX,
        state.selectionBox.currentY
      );
      const keys = checkGeometryStartingPoints(
        normalizedPoints,
        state.realGeometry.map((e) => ({ ...e }))
      );
      if (keys.length > 0) {
        state.selectedGeometry.push(
          ...state.realGeometry.map((g) => {
            if (keys.includes(g.key)) return g;
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
      }
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
      }
    },
    startAugmentingVirtualGeometry: (state, action) => {
      const { offsetX, offsetY } = action.payload;
      state.virtualGeometryBeingAltered = true;
      state.geometryAugment.start = {
        offsetX: parseFloat(offsetX),
        offsetY: parseFloat(offsetY),
      };
      state.geometryAugment.current = {
        offsetX: parseFloat(offsetX),
        offsetY: parseFloat(offsetY),
      };
    },
    updateVirtualGeometryAugment: (state, action) => {
      const { offsetX, offsetY } = action.payload;
      state.geometryAugment.current = {
        offsetX: parseFloat(offsetX),
        offsetY: parseFloat(offsetY),
      };
    },
    endAugment: (state, action) => {
      state.virtualGeometryBeingAltered = false;
      if (state.realGeometry.length === 1) {
        state.realGeometry = action.payload;
      } else {
        //replace each matching key with new element with updated coordiantes
        action.payload.forEach((g) =>
          state.realGeometry.splice(
            state.realGeometry.findIndex((e) => e.key === g.key), //find where it is
            1, //delete 1
            g //replace with new object
          )
        );
      }

      state.selectedGeometry = [];
    },
    addRealGeometry: (state, action) => {
      state.virtualGeometryBeingDrawn = false;
      state.virtualGeometryInputLocks = initialState.virtualGeometryInputLocks;
      state.virtualGeometry = {};
      state.realGeometry.push({
        ...action.payload,
        key: state.realGeometry.length + 1,
      });
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
      state.selectedGeometry.push(action.payload);
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
} = drawingControlSlice.actions;

export default drawingControlSlice.reducer;
