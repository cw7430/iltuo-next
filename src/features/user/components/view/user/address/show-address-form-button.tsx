'use client';

import { useShallow } from 'zustand/shallow';

import { useElementState } from '@/features/global/stores';
import { Button } from 'react-bootstrap';

interface Props {
  elementKey: string;
}

export default function ShowAddressFormButton({ elementKey }: Props) {
  const { elements, showElement, hideElement } = useElementState(
    useShallow((s) => ({
      elements: s.elements,
      showElement: s.showElement,
      hideElement: s.hideElement,
    })),
  );

  const isOpen = elements.includes(elementKey);

  const onClick = () => {
    if (isOpen) {
      hideElement(elementKey);
    } else {
      showElement(elementKey);
    }
  };

  return (
    <Button
      type="button"
      variant={isOpen ? 'danger' : 'primary'}
      onClick={onClick}
    >
      {isOpen ? '취소' : '주소추가'}
    </Button>
  );
}
