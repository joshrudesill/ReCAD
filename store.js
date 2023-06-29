import { configureStore } from "@reduxjs/toolkit";
import drawingControl from "./features/drawingControlSlice";
import UIControl from "./features/UIControlSlice";

export const store = configureStore({
  reducer: { drawingControl: drawingControl, UIControl: UIControl },
});
