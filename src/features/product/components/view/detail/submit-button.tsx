'use client';

import { Button } from 'react-bootstrap';

import { useAuthStore, validateAuthIntegrity } from '@/features/user/stores';
import { useDialogModalState, useModalState } from '@/features/global/stores';

interface Props {
  method: 'CART' | 'ORDER';
  productId: string;
  quantity: bigint;
  options: string[];
  validateOptions: () => boolean;
}

export default function SubmitButton({
  method,
  productId,
  quantity,
  options,
  validateOptions,
}: Props) {
  const showDialogModal = useDialogModalState((s) => s.showModal);
  const showModal = useModalState((s) => s.showModal);
  const isLoggedIn = useAuthStore((s) => validateAuthIntegrity(s));

  const showAuthModal = () => {
    if (!isLoggedIn) {
      showDialogModal({
        modal: 'alert',
        title: '경고',
        text: '로그인 하여주세요.',
        handleAfterClose: () => {
          showModal('Login');
        },
      });
    }
  };

  const onClick = () => {
    if (!isLoggedIn) {
      showAuthModal();
      return;
    }

    if (!validateOptions()) return;

    const body = {
      quantity,
      options,
    };

    const dummyData = `Method:${method}\nID: ${productId}\nBody: ${JSON.stringify(
      { quantity: quantity.toLocaleString(), options: body.options },
      null,
      2,
    )}`;

    alert(dummyData);
  };

  return (
    <Button
      variant={method === 'CART' ? 'primary' : 'danger'}
      onClick={onClick}
    >
      {method === 'CART' ? '장바구니' : '바로구매'}
    </Button>
  );
}
