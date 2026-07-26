export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  campaigns: '/campaigns',
  campaignDetail: (id = ':id') => `/campaigns/${id}`,
  dashboard: '/dashboard',
  profile: '/profile',
  payment: '/payment',
  notifications: '/notifications',
}
