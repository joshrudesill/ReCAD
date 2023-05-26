import { configureStore } from "@reduxjs/toolkit";
import drawingControl from "./features/drawingControlSlice";

export const store = configureStore({
  reducer: { drawingControl: drawingControl },
});
