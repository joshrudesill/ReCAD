import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentInstruction: {
    category: "",
    command: "",
    stage: "",
  },
  showGeometryInput: false,
  geometryInputDataFields: [],
  /* 
      {
        fieldName: string,
        fieldValue: number
        defaultValue: string | number
      } 
  */
  geometryInputMetaData: {},
};

export const UIControlSlice = createSlice({
  name: "UIControl",
  initialState,
  reducers: {
    setCurrentInstruction: (state, action) => {
      state.currentInstruction = action.payload;
    },
    toggleGeoInput: (state, action) => {
      state.showGeometryInput = action.payload;
    },
    addGeometryFields: (state, action) => {
      state.geometryInputDataFields = action.payload;
      let metadata = {};
      for (let i = 0; i < action.payload.length; i++) {
        const fieldname = state.geometryInputDataFields[i].fieldName;
        metadata[fieldname] = i;
      }
      state.geometryInputMetaData = metadata;
    },
    updateGeometryField: (state, action) => {
      const { field, value } = action.payload;
      state.geometryInputDataFields[
        state.geometryInputMetaData[field]
      ].fieldValue = value;
    },
  },
});

export const {
  setCurrentInstruction,
  addGeometryFields,
  toggleGeoInput,
  updateGeometryField,
} = UIControlSlice.actions;

export default UIControlSlice.reducer;
