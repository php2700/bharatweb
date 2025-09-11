import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to fetch initial emergency status
export const fetchEmergencyStatus = createAsyncThunk(
  "emergency/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await fetch(`${BASE_URL}/user/emergency`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch emergency status");
      }

      const data = await response.json();
      return data.isEmergencyOn; // Adjust based on your API response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update emergency status
export const updateEmergencyStatus = createAsyncThunk(
  "emergency/updateStatus",
  async (isEmergencyOn, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await fetch(`${BASE_URL}/user/emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEmergencyOn }),
      });

      if (!response.ok) {
        throw new Error("Failed to update emergency status");
      }

      const data = await response.json();
      return { isEmergencyOn, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const emergencySlice = createSlice({
  name: "emergency",
  initialState: {
    isEmergencyOn: false,
    notifications: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      const date = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      state.notifications.unshift({
        title: action.payload.title,
        message: action.payload.message,
        createdAt: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmergencyStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isEmergencyOn = action.payload;
      })
      .addCase(fetchEmergencyStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch emergency status.");
      })
      .addCase(updateEmergencyStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEmergencyStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isEmergencyOn = action.payload.isEmergencyOn;
        if (action.payload.isEmergencyOn) {
          state.notifications.unshift({
            title: "Emergency Mode",
            message: "You have turned on Emergency Mode!",
            createdAt: new Date().toISOString(),
          });
          toast.success("Emergency Mode turned on!");
        } else {
          toast.success("Emergency Mode turned off!");
        }
      })
      .addCase(updateEmergencyStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload || "Failed to update emergency status.");
      });
  },
});

export const { addNotification } = emergencySlice.actions;
export default emergencySlice.reducer;