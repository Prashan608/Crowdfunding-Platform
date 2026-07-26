const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiEndpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: (token) => `/auth/reset-password/${token}`,
  },

  campaigns: {
    create: "/campaigns/add",
    list: "/campaigns",
    detail: (id) => `/campaigns/${id}`,
    update: (id) => `/campaigns/${id}`,
    delete: (id) => `/campaigns/${id}`,
  },

  dashboard: {
    admin: "/dashboard/admin",
    creator: "/dashboard/creator",
    supporter: "/dashboard/supporter",
  },

  donations: {
    donate: (campaignId) => `/donations/${campaignId}`,
  },

  notifications: {
    list: "/notifications",
    detail: (id) => `/notifications/${id}`,
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
    delete: (id) => `/notifications/${id}`,
  },

  payments: {
    createOrder: "/payments/create-order",
    verify: "/payments/verify",
    history: "/payments/history",
    detail: (id) => `/payments/${id}`,
    campaignDonations: (campaignId) =>
      `/payments/campaign/${campaignId}/donations`,
    failure: "/payments/failure",
    webhook: "/payments/webhook",
  },
  profile: {
  get: "/profile",
  update: "/profile",
  changePassword: "/profile/change-password",
},
  ai: {
    chat: "/ai/chat",
  },

};

export const buildApiUrl = (endpoint) =>
  `${API_BASE_URL}${endpoint}`;