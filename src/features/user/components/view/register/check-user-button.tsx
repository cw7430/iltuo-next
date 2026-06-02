'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import type { UseFormSetError } from 'react-hook-form';
import { Button, Spinner } from 'react-bootstrap';

import { type NativeRegisterRequestDto } from '@/features/user/schema';
import { checkUser } from '@/features/user/request/server/actions';
import { USER_KEYS } from '@/features/user/constants';
import { ResponseCode } from '@/common/api/shared/constants';

interface Props {
  setError: UseFormSetError<NativeRegisterRequestDto>;
  isUserNameValid: boolean;
  setValidatedUserName: Dispatch<SetStateAction<string | null>>;
  userName: string;
}

export default function CheckUserButton({
  setError,
  isUserNameValid,
  setValidatedUserName,
  userName,
}: Props) {
  const mutation = useMutation({
    mutationKey: USER_KEYS.checkUser,
    mutationFn: checkUser,
    onSuccess: (res) => {
      if (res.code !== ResponseCode.SUCCESS.code) {
        switch (res.code) {
          case ResponseCode.DUPLICATE_RESOURCE.code:
            setError('userName', { message: '사용중인 아이디 입니다.' });
            break;

          default:
            setError('root', {
              message:
                '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
        setValidatedUserName(null);
        return;
      }

      setValidatedUserName(userName);
    },
    onError: () => {
      setError('root', {
        message: '서버에서 문제가 발생했습니다.',
      });
    },
  });

  const isPending =
    useIsMutating({ mutationKey: USER_KEYS.register }) > 0 ||
    mutation.isPending;

  const onClick = () => {
    mutation.mutate({ userName });
  };

  return (
    <Button
      variant="success"
      onClick={onClick}
      disabled={isUserNameValid || isPending}
    >
      {isPending && <Spinner size="sm" />}
      {'중복체크'}
    </Button>
  );
}
