'use client';

import { Col, Row } from 'react-bootstrap';

import { useElementState } from '@/features/global/stores';

interface Props {
  elementKey: string;
}

export default function AddressForm({ elementKey }: Props) {
  const elements = useElementState((s) => s.elements);

  const isOpen = elements.includes(elementKey);

  return (
    <>
      {!!isOpen && (
        <Row className="justify-content-center">
          <Col
            className="mt-3"
            style={{ minWidth: '480px', maxWidth: '600px' }}
          ></Col>
        </Row>
      )}
    </>
  );
}
