import { Button, Col, Container, Row } from 'react-bootstrap';

import type { UserResponseDto } from '@/features/user/schema';

interface Props {
  profile: UserResponseDto;
}

export default function UserProfile({ profile }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">{'프로필 정보'}</h5>
      </div>
      <div className="card-body">
        <p>
          <strong>{'아이디: '}</strong> {profile.userName}
        </p>
        <p>
          <strong>{'이름: '}</strong> {profile.realName}
        </p>
        <p>
          <strong>{'이메일: '}</strong> {profile.email}
        </p>
        <p>
          <strong>{'전화번호: '}</strong> {profile.phoneNumber}
        </p>
      </div>
      {profile.authType !== 'SOCIAL' && (
        <div className="card-footer">
          <Container>
            <Row className="text-end">
              <Col>
                <Button type="button" variant="primary">
                  {'회원정보 변경'}
                </Button>
                <Button type="button" variant="danger" className="ms-2">
                  {'비밀번호 변경'}
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
}
