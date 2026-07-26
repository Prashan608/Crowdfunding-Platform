import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import campaignReducer from "./campaignSlice";
import paymentReducer from "./paymentSlice";
import dashboardReducer from "./dashboardSlice";
import profileReducer from "./profileSlice";
import notificationReducer from "./notificationSlice";
import aiReducer from "./aiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    notification: notificationReducer,
    ai: aiReducer, 
  },
});