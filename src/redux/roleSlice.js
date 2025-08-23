// src/redux/roleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRoles: [], // single select ke liye
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    selectRole: (state, action) => {
      state.selectedRoles = [action.payload]; // sirf ek role rakho
    },
  },
});

export const { selectRole } = roleSlice.actions;
export default roleSlice.reducer;
