import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentInstruction: {
    category: "",
    command: "",
    stage: "",
  },
};

export const UIControlSlice = createSlice({
  name: "UIControl",
  initialState,
  reducers: {
    setCurrentInstruction: (state, action) => {
      state.currentInstruction = action.payload;
    },
  },
});

export const { setCurrentInstruction } = UIControlSlice.actions;

export default UIControlSlice.reducer;
