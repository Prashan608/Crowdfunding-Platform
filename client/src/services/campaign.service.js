import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

// ==========================
// Get All Campaigns
// ==========================

export const getCampaigns = () => {
  return api.get(apiEndpoints.campaigns.list);
};

// ==========================
// Get Campaign By Id
// ==========================

export const getCampaignById = (id) => {
  return api.get(apiEndpoints.campaigns.detail(id));
};

// ==========================
// Create Campaign
// ==========================

export const createCampaign = (data) => {
  return api.post(apiEndpoints.campaigns.create, data);
};

// ==========================
// Update Campaign
// ==========================

export const updateCampaign = (id, data) => {
  return api.put(apiEndpoints.campaigns.update(id), data);
};

// ==========================
// Delete Campaign
// ==========================

export const deleteCampaign = (id) => {
  return api.delete(apiEndpoints.campaigns.delete(id));
};