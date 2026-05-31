'use client';

import { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import { Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';

import { useAppConfigStore, useModalState } from '@/features/global/stores';
import { useAuthStore } from '@/features/user/stores';
import {
  loginRequestSchema,
  type LoginRequestDto,
} from '@/features/user/schema';
import { loginAction } from '@/features/user/request/server/actions';
import { ResponseCode } from '@/common/api/shared/constants';
import { USER_KEYS } from '@/features/user/constants';

interface Props {
  modalKey: string;
}

export default function LoginModal({ modalKey }: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );

  const { isAutoLogin, setAutoLogin } = useAppConfigStore(
    useShallow((s) => ({
      isAutoLogin: s.isAutoLogin,
      setAutoLogin: s.setAutoLogin,
    })),
  );
  const login = useAuthStore((s) => s.login);

  const isOpen = modals.includes(modalKey);

  const loginForm = useForm<LoginRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      userName: '',
      password: '',
      isAuto: isAutoLogin,
    },
  });

  const {
    handleSubmit,
    control,
    clearErrors,
    setValues,
    setError,
    formState: { errors },
  } = loginForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('userName');
      clearErrors('password');
    }
  };

  const mutation = useMutation({
    mutationKey: USER_KEYS.login,
    mutationFn: loginAction,
    onSuccess: (res) => {
      if (res.code !== ResponseCode.SUCCESS.code) {
        switch (res.code) {
          case ResponseCode.LOGIN_ERROR.code:
          case ResponseCode.VALIDATION_ERROR.code:
            setError('root', {
              message: '아이디 또는 비밀번호가 올바르지 않습니다.',
            });
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
      closeModal(modalKey);
    },
    onError: () => {
      setError('root', {
        message: '서버에서 문제가 발생했습니다.',
      });
    },
  });

  const onSubmit: SubmitHandler<LoginRequestDto> = (req) => {
    mutation.mutate(req);
  };

  useEffect(() => {
    if (!isOpen) {
      setValues({ userName: '', password: '' });
    }
  }, [isOpen, setValues]);

  return (
    <Modal
      backdrop="static"
      show={!!isOpen}
      onHide={() => closeModal(modalKey)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{'로그인'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onChange={handleFormChange}
          noValidate
        >
          <Form.Group className="mb-3" controlId="login.userName">
            <Form.Label>{'아이디'}</Form.Label>
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
                    disabled={mutation.isPending}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.userName?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="login.password">
            <Form.Label>{'비밀번호'}</Form.Label>
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
                    placeholder="비밀번호를 입력하세요"
                    disabled={mutation.isPending}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Controller
            control={control}
            name="isAuto"
            render={({ field }) => (
              <Form.Check
                type="checkbox"
                label="자동 로그인"
                id="login.is-auto"
                className="mb-3"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.currentTarget.checked);
                  setAutoLogin(e.currentTarget.checked);
                }}
                disabled={mutation.isPending}
              />
            )}
          />
          {errors.root && (
            <div className="d-block invalid-feedback mb-2">
              {errors.root.message}
            </div>
          )}
          <div className="d-grid gap-2 mb-3">
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Spinner size="sm" />}
              {'로그인'}
            </Button>
          </div>
          <hr />
          <div className="text-center text-muted mb-2">소셜 로그인</div>
          <p>준비중</p>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => closeModal(modalKey)}
          disabled={mutation.isPending}
        >
          {'닫기'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
