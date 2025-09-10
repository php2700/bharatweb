import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";
import userReducer from "./userSlice";
import emergencyReducer from "./emergencySlice";

const store = configureStore({
  reducer: {
    role: roleReducer,
    user: userReducer,
    emergency: emergencyReducer,
  },
});

export default store;
