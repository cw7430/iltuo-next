'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';

import {
  nativeRegisterRequestSchema,
  type NativeRegisterRequestDto,
} from '@/features/user/schema';
import { registerAction } from '@/features/user/request/server/actions';
import { USER_KEYS } from '@/features/user/constants';
import CheckUserButton from './check-user-button';
import { hypenPhone } from '@/common/lib';
import { ResponseCode } from '@/common/api/shared/constants';
import { useAuthStore } from '@/features/user/stores';
import { useDialogModalState } from '@/features/global/stores';

export default function RegisterForm() {
  const router = useRouter();

  const showDialogModal = useDialogModalState((s) => s.showModal);
  const login = useAuthStore((s) => s.login);

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

  const mutation = useMutation({
    mutationKey: USER_KEYS.register,
    mutationFn: registerAction,
    onSuccess: (res) => {
      if (res.code !== ResponseCode.SUCCESS.code) {
        switch (res.code) {
          case ResponseCode.DUPLICATE_RESOURCE.code:
            setError('userName', { message: '사용중인 아이디 입니다.' });
            setValidatedUserName(null);
            break;

          default:
            setError('root', {
              message:
                '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
        return;
      }
      login(res.result);
      showDialogModal({
        modal: 'alert',
        title: '완료',
        text: '회원 가입이 완료되었습니다.',
        handleAfterClose: () => {
          router.replace('/');
        },
      });
    },
    onError: () => {
      setError('root', {
        message: '서버에서 문제가 발생했습니다.',
      });
    },
  });

  const onSubmit: SubmitHandler<NativeRegisterRequestDto> = (req) => {
    if (!isUserNameValid) {
      setError('userName', { message: '아이디 중복체크를 해주세요.' });
      return;
    }
    showDialogModal({
      modal: 'confirm',
      title: '확인',
      text: '회원 가입을 진행하시겠습니까?',
      handleAfterClose: () => {
        mutation.mutate(req);
      },
    });
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

  const isPending =
    useIsMutating({ mutationKey: USER_KEYS.checkUser }) > 0 ||
    mutation.isPending;

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
                maxLength={13}
                placeholder="휴대전화 번호를 입력해주세요."
                onChange={(e) => field.onChange(hypenPhone(e.target.value))}
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
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      {errors.root && (
        <div className="d-block invalid-feedback mb-2">
          {errors.root.message}
        </div>
      )}
      <div className="d-flex gap-2">
        <Button
          variant="primary"
          type="submit"
          size="lg"
          className="flex-fill"
          disabled={isPending}
        >
          {mutation.isPending && <Spinner size="sm" />}
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
