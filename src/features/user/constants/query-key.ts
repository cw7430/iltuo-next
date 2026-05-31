const ALL_KEY = 'user';

export const USER_KEYS = {
  all: [ALL_KEY] as const,
  login: [ALL_KEY, 'login'] as const,
  logout: [ALL_KEY, 'logout'] as const,
  refresh: [ALL_KEY, 'refresh'] as const,
  checkUser: [ALL_KEY, 'check-user'] as const,
  register: [ALL_KEY, 'register'] as const,
};
