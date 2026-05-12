import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  AuthState,
  AuthStateData,
  LoginAndRefreshResponseDto,
} from '@/features/user/schema';

const initialState = {
  accessTokenExpiresAtMs: null,
  authRole: null,
  authType: null,
};

const validateAuthIntegrity = (state: AuthStateData) => {
  const { accessTokenExpiresAtMs, authRole, authType } = state;

  return !!(
    authRole &&
    authType &&
    accessTokenExpiresAtMs &&
    Date.now() + 30 * 1000 < accessTokenExpiresAtMs
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hasHydrated: false,

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),

      login: (data: LoginAndRefreshResponseDto) =>
        set({
          accessTokenExpiresAtMs: data.accessTokenExpiresAtMs,
          authRole: data.authRole,
          authType: data.authType,
        }),

      checkAuth: () => validateAuthIntegrity(get()),

      logout: () => set(initialState),
    }),
    {
      name: 'auth-storage',

      partialize: (state) => ({
        accessTokenExpiresAtMs: state.accessTokenExpiresAtMs,
        authRole: state.authRole,
        authType: state.authType,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
