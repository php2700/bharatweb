import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";
import userReducer from "./userSlice";
import emergencyReducer from "./emergencySlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    role: roleReducer,
    user: userReducer,
    emergency: emergencyReducer,
    notification: notificationReducer,
  },
});

export default store;
