import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteNotificationById,
  getNotificationById,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      return await getNotifications();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  "notification/fetchNotificationById",
  async (id, thunkAPI) => {
    try {
      return await getNotificationById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  "notification/markNotificationRead",
  async (id, thunkAPI) => {
    try {
      const response = await markNotificationAsRead(id);

      return {
        id,
        response,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const markAllNotificationsReadThunk = createAsyncThunk(
  "notification/markAllNotificationsRead",
  async (_, thunkAPI) => {
    try {
      return await markAllNotificationsAsRead();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk(
  "notification/deleteNotification",
  async (id, thunkAPI) => {
    try {
      const response = await deleteNotificationById(id);

      return {
        id,
        response,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  notifications: [],
  selectedNotification: null,
  unreadCount: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

const getPayloadData = (payload) => payload?.data || payload;

const normalizeNotifications = (payload) => {
  const data = getPayloadData(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getUnreadCount = (notifications) => {
  return notifications.filter((notification) => !notification?.isRead).length;
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
    addSocketNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount = getUnreadCount(state.notifications);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = normalizeNotifications(action.payload);
        state.unreadCount = getUnreadCount(state.notifications);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNotification = getPayloadData(action.payload);
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationReadThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload.id
            ? { ...notification, isRead: true }
            : notification
        );

        if (state.selectedNotification?.id === action.payload.id) {
          state.selectedNotification = {
            ...state.selectedNotification,
            isRead: true,
          };
        }

        state.unreadCount = getUnreadCount(state.notifications);
      })
      .addCase(markNotificationReadThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(markAllNotificationsReadThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        state.actionLoading = false;

        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));

        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsReadThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteNotificationThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload.id
        );

        if (state.selectedNotification?.id === action.payload.id) {
          state.selectedNotification = null;
        }

        state.unreadCount = getUnreadCount(state.notifications);
      })
      .addCase(deleteNotificationThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addSocketNotification,
  clearNotificationError,
  clearSelectedNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;