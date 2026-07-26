import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

export const createPaymentOrder = (data) => {
  return api.post(apiEndpoints.payments.createOrder, data);
};

export const verifyPayment = (data) => {
  return api.post(apiEndpoints.payments.verify, data);
};

export const getPaymentHistory = () => {
  return api.get(apiEndpoints.payments.history);
};

export const getPaymentById = (id) => {
  return api.get(apiEndpoints.payments.detail(id));
};

export const getCampaignDonations = (campaignId) => {
  return api.get(apiEndpoints.payments.campaignDonations(campaignId));
};

export const markPaymentFailed = (data) => {
  return api.post(apiEndpoints.payments.failure, data);
};