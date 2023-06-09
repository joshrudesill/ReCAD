import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  virtualGeometryBeingDrawn: false,
  virtualGeometryBeingAltered: false,
  virtualGeometry: {},
  geometryAugment: { start: { x: 0, y: 0 }, current: { x: 0, y: 0 } },
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
      const { startingX, startingY, gType, stageX, stageY, startingZoom } =
        action.payload;
      state.virtualGeometryBeingDrawn = true;
      state.virtualGeometry = {
        startingX: startingX,
        startingY: startingY,
        currentX: startingX,
        currentY: startingY,
        stageX: stageX,
        stageY: stageY,
        startingZoom: startingZoom,
        gType: gType,
      };
    },
    updateVirtualGeometry: (state, action) => {
      const { x, y } = action.payload;
      state.virtualGeometry.currentX = x;
      state.virtualGeometry.currentY = y;
    },
    startAugmentingVirtualGeometry: (state, action) => {
      const { offsetX, offsetY } = action.payload;
      state.virtualGeometryBeingAltered = true;
      state.geometryAugment.start = { offsetX, offsetY };
      state.geometryAugment.current = { offsetX, offsetY };
    },
    updateVirtualGeometryAugment: (state, action) => {
      const { offsetX, offsetY } = action.payload;
      state.geometryAugment.current = { offsetX, offsetY };
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
      state.stageZoomScaleInverse = (1 / action.payload).toFixed(2);
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
  updateVirtualGeometryAugment,
  startAugmentingVirtualGeometry,
  updateStageOffset,
  updateStageZoomScale,
  resetSelectedGeometry,
  updateCursorPosition,
  addSelectedGeometry,
  endAugment,
} = drawingControlSlice.actions;

export default drawingControlSlice.reducer;
