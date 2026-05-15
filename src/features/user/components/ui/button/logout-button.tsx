'use client';

import { useMutation } from '@tanstack/react-query';

import { logoutAction } from '@/features/user/request/server/actions';
import { useAuthStore } from '@/features/user/stores';
import { USER_KEYS } from '@/features/user/constants';
import { Spinner } from 'react-bootstrap';

export default function LogoutButton({
  ...props
}: React.ComponentProps<'button'>) {
  const logout = useAuthStore((s) => s.logout);

  const mutation = useMutation({
    mutationKey: USER_KEYS.logout,
    mutationFn: logoutAction,
    onSettled: () => {
      logout();
    },
  });

  const onClick = async () => {
    mutation.mutate();
  };

  return (
    <button type="button" onClick={onClick} {...props}>
      {mutation.isPending && <Spinner size="sm" />}
      {'로그아웃'}
    </button>
  );
}
