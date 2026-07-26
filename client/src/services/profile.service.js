import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

export const getProfile = () => {
  return api.get(apiEndpoints.profile.get);
};

export const updateProfile = (data) => {
  return api.put(apiEndpoints.profile.update, data);
};

export const changePassword = (data) => {
  return api.put(apiEndpoints.profile.changePassword, data);
};