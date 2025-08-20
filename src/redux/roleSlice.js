import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    selectedRoles: [],
  },
  reducers: {
    toggleRole: (state, action) => {
      const role = action.payload;
      if (state.selectedRoles.includes(role)) {
        state.selectedRoles = state.selectedRoles.filter((r) => r !== role);
      } else {
        state.selectedRoles.push(role);
      }
    },
    clearRoles: (state) => {
      state.selectedRoles = [];
    },
  },
});

export const { toggleRole, clearRoles } = roleSlice.actions;
export default roleSlice.reducer;
