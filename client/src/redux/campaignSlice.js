import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCampaign,
  deleteCampaign,
  getCampaignById,
  getCampaigns,
  updateCampaign,
} from "../services/campaign.service";

// ==========================
// Fetch Campaigns
// ==========================

export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async (_, thunkAPI) => {
    try {
      return await getCampaigns();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Fetch Campaign By Id
// ==========================

export const fetchCampaignById = createAsyncThunk(
  "campaign/fetchCampaignById",
  async (id, thunkAPI) => {
    try {
      return await getCampaignById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Create Campaign
// ==========================

export const addCampaign = createAsyncThunk(
  "campaign/addCampaign",
  async (campaignData, thunkAPI) => {
    try {
      return await createCampaign(campaignData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Update Campaign
// ==========================

export const editCampaign = createAsyncThunk(
  "campaign/editCampaign",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateCampaign(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ==========================
// Delete Campaign
// ==========================

export const removeCampaign = createAsyncThunk(
  "campaign/removeCampaign",
  async (id, thunkAPI) => {
    try {
      await deleteCampaign(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const getCampaignPayload = (payload) => {
  return payload?.data || payload;
};

const campaignSlice = createSlice({
  name: "campaign",

  initialState,

  reducers: {
    clearCampaignError: (state) => {
      state.error = null;
    },

    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = getCampaignPayload(action.payload) || [];
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Campaign By Id
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedCampaign = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCampaign = getCampaignPayload(action.payload);
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Campaign
      .addCase(addCampaign.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addCampaign.fulfilled, (state, action) => {
        state.actionLoading = false;

        const campaign = getCampaignPayload(action.payload);

        if (campaign) {
          state.campaigns.unshift(campaign);
        }
      })
      .addCase(addCampaign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update Campaign
      .addCase(editCampaign.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(editCampaign.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedCampaign = getCampaignPayload(action.payload);

        if (!updatedCampaign?.id) return;

        state.campaigns = state.campaigns.map((campaign) =>
          campaign.id === updatedCampaign.id ? updatedCampaign : campaign
        );

        if (state.selectedCampaign?.id === updatedCampaign.id) {
          state.selectedCampaign = updatedCampaign;
        }
      })
      .addCase(editCampaign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete Campaign
      .addCase(removeCampaign.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeCampaign.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.campaigns = state.campaigns.filter(
          (campaign) => campaign.id !== action.payload
        );

        if (state.selectedCampaign?.id === action.payload) {
          state.selectedCampaign = null;
        }
      })
      .addCase(removeCampaign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCampaignError, clearSelectedCampaign } =
  campaignSlice.actions;

export default campaignSlice.reducer;