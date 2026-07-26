import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../services/profile.service";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "profile/updateProfile",
  async (payload, thunkAPI) => {
    try {
      return await updateProfile(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "profile/changePassword",
  async (payload, thunkAPI) => {
    try {
      return await changePassword(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  actionLoading: false,
  passwordLoading: false,
  error: null,
};

const getPayloadData = (payload) => payload?.data || payload;

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfileState: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = getPayloadData(action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfileThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = getPayloadData(action.payload);
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(changePasswordThunk.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.passwordLoading = false;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, clearProfileState } = profileSlice.actions;

export default profileSlice.reducer;