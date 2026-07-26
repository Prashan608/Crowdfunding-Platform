import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

export const getAdminDashboard = () => {
  return api.get(apiEndpoints.dashboard.admin);
};

export const getCreatorDashboard = () => {
  return api.get(apiEndpoints.dashboard.creator);
};

export const getSupporterDashboard = () => {
  return api.get(apiEndpoints.dashboard.supporter);
};