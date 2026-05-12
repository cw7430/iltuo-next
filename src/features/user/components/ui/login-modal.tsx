'use client';

import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

import { useAppConfigStore, useModalState } from '@/features/global/stores';
import {
  loginRequestSchema,
  type LoginRequestDto,
} from '@/features/user/schema';

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
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = loginForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('userName');
      clearErrors('password');
    }
  };

  const onSubmit: SubmitHandler<LoginRequestDto> = (req) => {
    alert(req);
  };

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
          <Form.Group className="mb-3" controlId="login.userId">
            <Form.Label>{'아이디'}</Form.Label>
            <InputGroup></InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => closeModal(modalKey)}>
          {'닫기'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
