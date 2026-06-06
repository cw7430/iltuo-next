'use client';

import { ListGroup, Container, Row, Col, Button } from 'react-bootstrap';

import { type AddressListResponseDto } from '@/features/user/schema';

interface Props {
  addressList: AddressListResponseDto;
}

export default function AddressList({ addressList }: Props) {
  return (
    <ListGroup variant="flush">
      {addressList.map((address) => (
        <ListGroup.Item className="py-2" key={address.addressId}>
          <Container>
            <Row>
              <Col xs={1} className="d-flex align-items-center"></Col>
              <Col xs={6}>
                {address.isMain && (
                  <span className="badge bg-danger mb-1">{'메인 주소'}</span>
                )}
                <div>{address.postalCode}</div>
                <div>
                  {address.defaultAddress} {address.detailAddress}
                </div>
                <div>{address.extraAddress}</div>
              </Col>
              <Col
                xs={5}
                className="d-flex align-items-center justify-content-end"
              >
                {!address.isMain && (
                  <Button type="button" variant="warning">
                    {'메인지정'}
                  </Button>
                )}
                <Button type="button" variant="danger" className="ms-2">
                  {'삭제'}
                </Button>
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
