import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  virtualGeometryBeingDrawn: false,
  virtualGeometryBeingAltered: false,
  virtualGeometry: {},
  realGeometry: [],
  stageOffset: { x: -100, y: -800 },
  stageZoomScale: 1,
  stageZoomScaleInverse: 1,
  selectedGeometry: [],
  cursorPosition: { x: 0, y: 0 },
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
    /**
     * Sets virtualGeometryBeingDrawn top true and starts virtualGeometry
     * @param {object} action Pass in starting X, Y, and type of geometry.
     */

    startDrawingVirtualGeometry: (state, action) => {
      const { startingX, startingY, gType } = action.payload;
      state.virtualGeometryBeingDrawn = true;
      state.virtualGeometry = {
        startingX: startingX,
        startingY: startingY,
        currentX: startingX,
        currentY: startingY,
        gType: gType,
      };
    },
    updateVirtualGeometry: (state, action) => {
      const { x, y } = action.payload;
      state.virtualGeometry.currentX = x;
      state.virtualGeometry.currentY = y;
    },
    addRealGeometry: (state, action) => {
      state.virtualGeometryBeingDrawn = false;
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
      state.stageZoomScaleInverse = 1 / action.payload;
    },
    addSelectedGeometry: (state, action) => {
      state.selectedGeometry.push(action.payload);
    },
    resetSelectedGeometry: (state) => {
      state.selectedGeometry = [];
    },

    updateCursorPosition: (state, action) => {
      state.cursorPosition = action.payload;
    },
  },
});

export const {
  toggleVirtualDrawing,
  updateVirtualGeometry,
  startDrawingVirtualGeometry,
  addRealGeometry,
  updateStageOffset,
  updateStageZoomScale,
  resetSelectedGeometry,
  updateCursorPosition,
  addSelectedGeometry,
} = drawingControlSlice.actions;

export default drawingControlSlice.reducer;
