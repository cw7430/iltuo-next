'use client';

import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  nativeRegisterRequestSchema,
  type NativeRegisterRequestDto,
} from '@/features/user/schema';
import { USER_KEYS } from '@/features/user/constants';
import CheckUserButton from './check-user-button';

export default function RegisterForm() {
  const [isUserNameValid, setUserNameValid] = useState<boolean>(false);

  const registerForm = useForm<NativeRegisterRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(nativeRegisterRequestSchema),
    defaultValues: {
      userName: '',
      password: '',
      confirmPassword: '',
      realName: '',
      phoneNumber: '',
      email: '',
    },
  });

  const {
    handleSubmit,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = registerForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('userName');
      clearErrors('password');
      clearErrors('confirmPassword');
      clearErrors('realName');
      clearErrors('phoneNumber');
      clearErrors('email');
    }
  };

  const onSubmit: SubmitHandler<NativeRegisterRequestDto> = (req) => {
    alert(JSON.stringify(req, null, 2));
  };

  const userName = useWatch({
    control,
    name: 'userName',
  });

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      noValidate
    >
      <Form.Group className="mb-3" controlId="register.userName">
        <Form.Label>{'아이디 *'}</Form.Label>
        <InputGroup>
          <Controller
            control={control}
            name="userName"
            render={({ field }) => (
              <Form.Control
                type="text"
                {...field}
                isInvalid={!!errors.userName}
                maxLength={25}
                placeholder="아이디를 입력하세요"
                isValid={isUserNameValid}
              />
            )}
          />
          <CheckUserButton
            isUserNameValid={isUserNameValid}
            setUserNameValid={setUserNameValid}
            setError={setError}
            userName={userName}
          />
          <Form.Control.Feedback>
            {'사용 가능한 아이디입니다.'}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            {errors.userName?.message}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </Form>
  );
}
