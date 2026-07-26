import api from "./api";
import { apiEndpoints } from "../constants/apiEndpoints";

export const getNotifications = () => {
  return api.get(apiEndpoints.notifications.list);
};

export const getNotificationById = (id) => {
  return api.get(apiEndpoints.notifications.detail(id));
};

export const markNotificationAsRead = (id) => {
  return api.patch(apiEndpoints.notifications.markRead(id));
};

export const markAllNotificationsAsRead = () => {
  return api.patch(apiEndpoints.notifications.markAllRead);
};

export const deleteNotificationById = (id) => {
  return api.delete(apiEndpoints.notifications.delete(id));
};