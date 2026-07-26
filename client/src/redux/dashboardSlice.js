import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAdminDashboard,
  getCreatorDashboard,
  getSupporterDashboard,
} from "../services/dashboard.service";

export const fetchAdminDashboard = createAsyncThunk(
  "dashboard/fetchAdminDashboard",
  async (_, thunkAPI) => {
    try {
      return await getAdminDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCreatorDashboard = createAsyncThunk(
  "dashboard/fetchCreatorDashboard",
  async (_, thunkAPI) => {
    try {
      return await getCreatorDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchSupporterDashboard = createAsyncThunk(
  "dashboard/fetchSupporterDashboard",
  async (_, thunkAPI) => {
    try {
      return await getSupporterDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  adminDashboard: null,
  creatorDashboard: null,
  supporterDashboard: null,
  loading: false,
  error: null,
};

const getPayloadData = (payload) => payload?.data || payload;

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    clearDashboardState: (state) => {
      state.adminDashboard = null;
      state.creatorDashboard = null;
      state.supporterDashboard = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDashboard = getPayloadData(action.payload);
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCreatorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.creatorDashboard = getPayloadData(action.payload);
      })
      .addCase(fetchCreatorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSupporterDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupporterDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.supporterDashboard = getPayloadData(action.payload);
      })
      .addCase(fetchSupporterDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError, clearDashboardState } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;