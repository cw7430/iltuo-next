'use client';

import { type Dispatch, type SetStateAction } from 'react';
import type { UseFormSetError } from 'react-hook-form';
import { Button } from 'react-bootstrap';

import { type NativeRegisterRequestDto } from '@/features/user/schema';

interface Props {
  setError: UseFormSetError<NativeRegisterRequestDto>;
  isUserNameValid: boolean;
  setUserNameValid: Dispatch<SetStateAction<boolean>>;
  userName: string;
}

export default function CheckUserButton({
  setError,
  isUserNameValid,
  setUserNameValid,
  userName,
}: Props) {
  return (
    <Button variant="primary" disabled={isUserNameValid}>
      {'중복체크'}
    </Button>
  );
}
