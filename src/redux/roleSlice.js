// src/redux/roleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRole: "", // ✅ ab ye string hoga
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    selectRole: (state, action) => {
      state.selectedRole = action.payload; // ✅ sirf ek string assign hoga
    },
  },
});

export const { selectRole } = roleSlice.actions;
export default roleSlice.reducer;
