import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      console.log("fetchUserProfile: No token found, rejecting");
      return rejectWithValue("No token found, user not logged in");
    }

    // Basic token format validation (e.g., expecting JWT-like structure)
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      console.log("fetchUserProfile: Invalid token format, rejecting");
      return rejectWithValue("Invalid token format");
    }

    // console.log("fetchUserProfile: Attempting API call with token:", token.slice(0, 10) + "...");
    try {
      const res = await fetch(`${BASE_URL}/user/getUserProfileData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if(res.status===403){
        console.log("fetchUserProfile: 403 Forbidden, clearing token");
          localStorage.removeItem("bharat_token");
          localStorage.removeItem("isProfileComplete");
          localStorage.removeItem("role");
          localStorage.removeItem("otp");
          localStorage.removeItem("selectedAddressId");
          window.location.href = "/login"; // Redirect to login
          return rejectWithValue("Access forbidden, please log in again");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (res.status === 401) {
          console.log("fetchUserProfile: 401 Unauthorized, clearing token");
          localStorage.removeItem("bharat_token");
          localStorage.removeItem("isProfileComplete");
          localStorage.removeItem("role");
          localStorage.removeItem("otp");
          localStorage.removeItem("selectedAddressId");
          toast.error( "Admin has disabled your account.");
          window.location.href = "/login"; // Redirect to login
          
          return rejectWithValue("Session expired, please log in again");
        }
        console.log("fetchUserProfile: Failed with status", res.status, errorData?.message);
  //       localStorage.removeItem("bharat_token");
  // localStorage.removeItem("isProfileComplete");
  // localStorage.removeItem("otp");
  // localStorage.removeItem("role");
        return rejectWithValue(errorData?.message || "Failed to fetch profile");
      }

      const data = await res.json();
      // console.log("fetchUserProfile: Success, data received", data );
			localStorage.setItem('user_id',data.data._id);
      return data.data;
    } catch (err) {
      console.error("fetchUserProfile: Error:", err.message);
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
