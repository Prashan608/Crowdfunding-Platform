import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPaymentOrder,
  getCampaignDonations,
  getPaymentById,
  getPaymentHistory,
  markPaymentFailed,
  verifyPayment,
} from "../services/payment.service";

export const createOrderThunk = createAsyncThunk(
  "payment/createOrder",
  async (payload, thunkAPI) => {
    try {
      return await createPaymentOrder(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const verifyPaymentThunk = createAsyncThunk(
  "payment/verifyPayment",
  async (payload, thunkAPI) => {
    try {
      return await verifyPayment(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const markPaymentFailedThunk = createAsyncThunk(
  "payment/markPaymentFailed",
  async (payload, thunkAPI) => {
    try {
      return await markPaymentFailed(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchPaymentHistory",
  async (_, thunkAPI) => {
    try {
      return await getPaymentHistory();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  "payment/fetchPaymentById",
  async (id, thunkAPI) => {
    try {
      return await getPaymentById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCampaignDonations = createAsyncThunk(
  "payment/fetchCampaignDonations",
  async (campaignId, thunkAPI) => {
    try {
      return await getCampaignDonations(campaignId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  order: null,
  payment: null,
  payments: [],
  campaignDonations: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const getPayloadData = (payload) => payload?.data || payload;

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentState: (state) => {
      state.order = null;
      state.payment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.order = getPayloadData(action.payload);
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(verifyPaymentThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.payment = getPayloadData(action.payload);
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(markPaymentFailedThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(markPaymentFailedThunk.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(markPaymentFailedThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = getPayloadData(action.payload) || [];
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = getPayloadData(action.payload);
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCampaignDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignDonations = getPayloadData(action.payload) || [];
      })
      .addCase(fetchCampaignDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError, clearPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;