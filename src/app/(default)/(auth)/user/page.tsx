import { redirect } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';

import { UserAddress, UserProfile } from '@/features/user/components/view';
import { getProfile } from '@/features/user/request/server/models';
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

  const profileData = profileRes.result;

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
            <UserAddress />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
