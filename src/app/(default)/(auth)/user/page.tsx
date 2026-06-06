import { redirect } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';

import {
  AddressForm,
  UserAddress,
  UserProfile,
} from '@/features/user/components/view';
import {
  getAddressList,
  getProfile,
} from '@/features/user/request/server/models';
import { ResponseCode } from '@/common/api/shared/constants';
import { ApiError } from '@/common/api/shared/error';

export default async function UserPage() {
  const profileRes = await getProfile();

  if (profileRes.code === ResponseCode.UNAUTHORIZED.code) {
    redirect('/', 'replace');
  }

  if (profileRes.code !== ResponseCode.SUCCESS.code) {
    throw new ApiError(profileRes.code, profileRes.message);
  }

  const addressRes = await getAddressList();

  if (addressRes.code === ResponseCode.UNAUTHORIZED.code) {
    redirect('/', 'replace');
  }

  if (addressRes.code !== ResponseCode.SUCCESS.code) {
    throw new ApiError(addressRes.code, addressRes.message);
  }

  const profileData = profileRes.result;

  const addressData = addressRes.result;

  return (
    <div className="coffee_section layout_padding">
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="coffee_taital">{'내 프로필'}</h1>
          </Col>
        </Row>
      </Container>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col
            md={6}
            className="mb-4"
            style={{ minWidth: '480px', maxWidth: '600px' }}
          >
            <UserProfile profile={profileData} />
          </Col>
          <Col
            md={6}
            className="mb-4"
            style={{ minWidth: '480px', maxWidth: '600px' }}
          >
            <UserAddress addressList={addressData} />
          </Col>
        </Row>
        <AddressForm elementKey="address-form" />
      </Container>
    </div>
  );
}
