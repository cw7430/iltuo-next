'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMutating } from '@tanstack/react-query';
import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, InputGroup } from 'react-bootstrap';

import {
  nativeRegisterRequestSchema,
  type NativeRegisterRequestDto,
} from '@/features/user/schema';
import { USER_KEYS } from '@/features/user/constants';
import CheckUserButton from './check-user-button';

export default function RegisterForm() {
  const router = useRouter();

  const isPending = useIsMutating({ mutationKey: USER_KEYS.checkUser }) > 0;

  const [validatedUserName, setValidatedUserName] = useState<string | null>(
    null,
  );

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

  const [userName, password, confirmPassword] = useWatch({
    control,
    name: ['userName', 'password', 'confirmPassword'],
  });

  const isUserNameValid = validatedUserName === userName;

  const isPasswordMatch =
    !!password &&
    !!confirmPassword &&
    !errors.password &&
    password === confirmPassword;

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
                placeholder="5자 이상 25자 이하, 영문 또는 영문, 숫자의 조합."
                isValid={isUserNameValid}
                disabled={isPending}
              />
            )}
          />
          <CheckUserButton
            isUserNameValid={isUserNameValid}
            setValidatedUserName={setValidatedUserName}
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
      <Form.Group className="mb-3" controlId="register.password">
        <Form.Label>{'비밀번호 *'}</Form.Label>
        <InputGroup>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Form.Control
                type="password"
                {...field}
                isInvalid={!!errors.password}
                maxLength={25}
                placeholder="10자 이상 25자 이하, 영문, 숫자, 특수문자의 조합."
                disabled={isPending}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId="register.confirm-password">
        <Form.Label>{'비밀번호 확인 *'}</Form.Label>
        <InputGroup>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Form.Control
                type="password"
                {...field}
                isInvalid={!!errors.confirmPassword}
                maxLength={25}
                placeholder="비밀번호를 다시 입력하세요."
                isValid={isPasswordMatch}
                disabled={isPending}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword?.message}
          </Form.Control.Feedback>
          <Form.Control.Feedback>
            {'비밀번호가 일치합니다.'}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId="register.real-name">
        <Form.Label>{'이름 *'}</Form.Label>
        <InputGroup>
          <Controller
            control={control}
            name="realName"
            render={({ field }) => (
              <Form.Control
                type="text"
                {...field}
                isInvalid={!!errors.realName}
                maxLength={100}
                placeholder="이름을 입력해주세요."
                disabled={isPending}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.realName?.message}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId="register.phone-number">
        <Form.Label>{'휴대전화 번호 *'}</Form.Label>
        <InputGroup>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <Form.Control
                type="text"
                {...field}
                isInvalid={!!errors.phoneNumber}
                maxLength={15}
                placeholder="휴대전화 번호를 입력해주세요."
                disabled={isPending}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phoneNumber?.message}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mb-3" controlId="register.email">
        <Form.Label>{'이메일 *'}</Form.Label>
        <InputGroup>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Form.Control
                type="text"
                {...field}
                isInvalid={!!errors.email}
                maxLength={100}
                placeholder="이메일을 입력해주세요."
                disabled={isPending}
              />
            )}
          />
        </InputGroup>
      </Form.Group>
      <div className="d-flex gap-2">
        <Button
          variant="primary"
          type="submit"
          size="lg"
          className="flex-fill"
          disabled={isPending}
        >
          {'회원가입'}
        </Button>
        <Button
          variant="danger"
          type="button"
          size="lg"
          className="flex-fill"
          onClick={() => router.push('/')}
          disabled={isPending}
        >
          {'홈으로'}
        </Button>
      </div>
    </Form>
  );
}
