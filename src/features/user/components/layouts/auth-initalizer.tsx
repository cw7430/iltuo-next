'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

import { refreshAction } from '@/features/user/request/server/actions';
import {
  useAppConfigStore,
  useDialogModalState,
} from '@/features/global/stores';
import { useAuthStore, validateAuthIntegrity } from '@/features/user/stores';
import type { RefreshRequestDto } from '@/features/user/schema';
import { USER_KEYS } from '@/features/user/constants';

interface Props {
  checkAccessToken: boolean;
}

export default function AuthInitializer({ checkAccessToken }: Props) {
  const isAutoLogin = useAppConfigStore((s) => s.isAutoLogin);
  const showModal = useDialogModalState((s) => s.showModal);
  const { isLoggedIn, logout, login, hasHydrated } = useAuthStore(
    useShallow((s) => ({
      isLoggedIn: validateAuthIntegrity(s),
      logout: s.logout,
      login: s.login,
      hasHydrated: s.hasHydrated,
    })),
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleAuthFailure = useCallback(() => {
    showModal({
      modal: 'alert',
      title: '세션만료',
      text: '세션이 만료되었습니다. 로그아웃합니다.',
      handleAfterClose: () => {
        logout();
        clearRefreshTimer();
      },
    });
  }, [showModal, logout, clearRefreshTimer]);

  const { mutateAsync: refreshMutate } = useMutation({
    mutationKey: USER_KEYS.refresh,
    mutationFn: refreshAction,
    onSuccess: (response, variables) => {
      if (response.code === 'SU') {
        const data = response.result;
        login(data);
        scheduleRefresh(data.accessTokenExpiresAtMs, variables);
      } else {
        handleAuthFailure();
      }
    },
    onError: () => {
      handleAuthFailure();
    },
  });

  const scheduleRefresh = useCallback(
    (expiresAt: number, req: RefreshRequestDto) => {
      clearRefreshTimer();

      const now = Date.now();
      const timeUntilRefresh = Math.max(0, expiresAt - now - 2 * 60 * 1000);

      timerRef.current = setTimeout(() => {
        refreshMutate(req);
      }, timeUntilRefresh);
    },
    [refreshMutate, clearRefreshTimer],
  );

  const recoverAuth = useCallback(
    async (req: RefreshRequestDto) => {
      const { accessTokenExpiresAtMs } = useAuthStore.getState();

      if (checkAccessToken && accessTokenExpiresAtMs && isLoggedIn) {
        scheduleRefresh(accessTokenExpiresAtMs, req);
        return;
      }
    },
    [scheduleRefresh, isLoggedIn, checkAccessToken],
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const req = { isAuto: isAutoLogin };
    recoverAuth(req);

    return () => clearRefreshTimer();
  }, [hasHydrated, isAutoLogin, recoverAuth, clearRefreshTimer]);

  return null;
}
