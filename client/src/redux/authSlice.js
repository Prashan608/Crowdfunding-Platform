import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "../services/auth.service";

// ==========================
// Register
// ==========================

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Login
// ==========================

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await loginUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Get Current User
// ==========================

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Forgot Password
// ==========================

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (emailData, thunkAPI) => {
    try {
      return await forgotPassword(emailData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Reset Password
// ==========================

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, data }, thunkAPI) => {
    try {
      return await resetPassword(token, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
  isAuthenticated: Boolean(storedToken),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        const response = action.payload;
        const token = response?.token || response?.data?.token;
        const user = response?.data || response?.user;

        state.loading = false;
        state.user = user || null;
        state.token = token || null;
        state.isAuthenticated = Boolean(token);

        if (token) {
          localStorage.setItem("token", token);
        }

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const user =
          action.payload?.data ||
          action.payload?.user ||
          action.payload;

        state.loading = false;
        state.user = user;
        state.isAuthenticated = Boolean(state.token);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })

      // Forgot Password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;