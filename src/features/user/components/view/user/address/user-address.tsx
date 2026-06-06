import { Col, Container, Row } from 'react-bootstrap';

import { type AddressListResponseDto } from '@/features/user/schema';
import AddressList from './address-list';

interface Props {
  addressList: AddressListResponseDto;
}

export default function UserAddress({ addressList }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">{'배송지 목록'}</h5>
      </div>
      <div className="card-body">
        {addressList.length === 0 ? (
          <p className="text-muted">{'등록된 주소가 없습니다.'}</p>
        ) : (
          <AddressList addressList={addressList} />
        )}
      </div>
      <div className="card-footer">
        <Container>
          <Row className="text-end">
            <Col></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
