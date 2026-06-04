'use client';

import { Card } from 'react-bootstrap';

import type { UserResponseDto } from '@/features/user/schema';

interface Props {
  profile: UserResponseDto;
}

export default function UserProfile({ profile }: Props) {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{'프로필 정보'}</h5>
      </Card.Header>
      <Card.Body>
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
      </Card.Body>
    </Card>
  );
}
