import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  virtualGeometryBeingDrawn: false,
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
  },
});

export const { toggleVirtualDrawing } = drawingControlSlice.actions;

export default drawingControlSlice.reducer;
