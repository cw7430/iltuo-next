'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { InputGroup, Form } from 'react-bootstrap';

interface Props {
  quantity: bigint;
  setQuantity: Dispatch<SetStateAction<bigint>>;
  updateTotalPrice: (currentQuantity: bigint) => void;
}

export default function QuantityInput({
  quantity,
  setQuantity,
  updateTotalPrice,
}: Props) {
  const sanitizeQuantity = (value: number) => {
    if (isNaN(value) || value <= 0) return 1n;
    if (value > 99) return 99n;
    return BigInt(value);
  };

  const handleQuantityFormat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = event.target.value.replace(/[^0-9]/g, '');
    const rawNumber = Number(formattedValue || '1');
    const sanitized = sanitizeQuantity(rawNumber);

    setQuantity(sanitized);
    updateTotalPrice(sanitized);
  };

  const handleQuantityBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const rawNumber = Number(event.target.value);
    const sanitized = sanitizeQuantity(rawNumber);

    setQuantity(sanitized);
    updateTotalPrice(sanitized);
  };

  return (
    <InputGroup style={{ width: '80px' }}>
      <Form.Control
        type="number"
        value={quantity.toString()}
        min={1}
        max={99}
        onChange={handleQuantityFormat}
        onBlur={handleQuantityBlur}
      />
    </InputGroup>
  );
}
