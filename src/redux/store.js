import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./roleSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    role: roleReducer,
    user: userReducer, 
  },
});

export default store;
