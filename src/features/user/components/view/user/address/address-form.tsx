'use client';

import { useEffect } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';

import { useDialogModalState, useElementState } from '@/features/global/stores';
import {
  addressRequestSchema,
  type AddressRequestDto,
} from '@/features/user/schema';
import PostCodeButton from './post-code-button';

interface Props {
  elementKey: string;
}

export default function AddressForm({ elementKey }: Props) {
  const elements = useElementState((s) => s.elements);
  const showDialogModal = useDialogModalState((s) => s.showModal);

  const isOpen = elements.includes(elementKey);

  const addressForm = useForm<AddressRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(addressRequestSchema),
    defaultValues: {
      postalCode: '',
      defaultAddress: '',
      detailAddress: undefined,
      extraAddress: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = addressForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('postalCode');
      clearErrors('defaultAddress');
    }
  };

  const onSubmit: SubmitHandler<AddressRequestDto> = (req) => {
    showDialogModal({
      modal: 'confirm',
      title: '확인',
      text: '주소 등록을 진행하시겠습니까?',
      handleAfterClose: () => {
        alert(JSON.stringify(req, null, 2));
      },
    });
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <>
      {!!isOpen && (
        <Row className="justify-content-center">
          <Col
            className="mt-3"
            style={{ minWidth: '480px', maxWidth: '600px' }}
          >
            <Card>
              <Card.Header>
                <h5 className="mb-0">{'주소등록'}</h5>
              </Card.Header>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                onChange={handleFormChange}
                noValidate
              >
                <Card.Body>
                  <Container>
                    <Row className="mb-2">
                      <Col style={{ maxWidth: '200px' }}>
                        <InputGroup>
                          <Controller
                            control={control}
                            name="postalCode"
                            render={({ field }) => (
                              <Form.Control
                                type="text"
                                {...field}
                                isInvalid={!!errors.postalCode}
                                maxLength={7}
                                readOnly={true}
                                placeholder="우편번호"
                              />
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.postalCode?.message}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                      <Col xs="auto">
                        <PostCodeButton setValue={setValue} />
                      </Col>
                    </Row>
                    <Form.Group className="mb-2">
                      <InputGroup>
                        <Controller
                          control={control}
                          name="defaultAddress"
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              {...field}
                              isInvalid={!!errors.defaultAddress}
                              readOnly={true}
                              placeholder="주소"
                            />
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.defaultAddress?.message}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Row className="mb-2">
                      <Form.Group as={Col}>
                        <InputGroup>
                          <Controller
                            control={control}
                            name="detailAddress"
                            render={({ field }) => (
                              <Form.Control
                                type="text"
                                {...field}
                                placeholder="상세 주소"
                              />
                            )}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group as={Col}>
                        <InputGroup>
                          <Controller
                            control={control}
                            name="extraAddress"
                            render={({ field }) => (
                              <Form.Control
                                type="text"
                                {...field}
                                placeholder="참고 항목"
                                readOnly={true}
                              />
                            )}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Container>
                  {errors.root && (
                    <div className="d-block invalid-feedback mb-2">
                      {errors.root.message}
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="text-end">
                  <Button variant="success" type="submit">
                    {'등록'}
                  </Button>
                </Card.Footer>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
