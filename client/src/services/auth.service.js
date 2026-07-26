import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

export const registerUser = (data) =>
  api.post(apiEndpoints.auth.register, data);

export const loginUser = (data) =>
  api.post(apiEndpoints.auth.login, data);

export const getCurrentUser = () =>
  api.get(apiEndpoints.auth.me);

export const forgotPassword = (data) =>
  api.post(apiEndpoints.auth.forgotPassword, data);

export const resetPassword = (token, data) =>
  api.post(apiEndpoints.auth.resetPassword(token), data);