'use client';

import { Button } from 'react-bootstrap';

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
  const onClick = () => {
    if (!validateOptions()) return;

    const body = {
      quantity,
      options,
    };

    const dummyData = `ID: ${productId}\nBody: ${JSON.stringify(
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
