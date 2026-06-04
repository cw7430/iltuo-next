'use client';

import { useRouter } from 'next/navigation';
import { useIsMutating } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';
import { Col, Row } from 'react-bootstrap';

import { useModalState } from '@/features/global/stores';
import { useAuthStore, validateAuthIntegrity } from '@/features/user/stores';
import { LoginModal, LogoutButton } from '@/features/user/components/ui';

export default function BtnGroup() {
  const router = useRouter();

  const loginModalKey = 'Login';

  const isMutating = useIsMutating() > 0;

  const showModal = useModalState((s) => s.showModal);
  const { isLoggedIn, hasHydrated } = useAuthStore(
    useShallow((s) => ({
      isLoggedIn: validateAuthIntegrity(s),
      hasHydrated: s.hasHydrated,
    })),
  );

  if (!hasHydrated) {
    return null;
  }

  return (
    <>
      <div className="form-inline my-2 my-lg-0">
        <div className="login_bt">
          <Row>
            {isLoggedIn && (
              <>
                <Col xs={6}>
                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => router.push('/user')}
                  >
                    <span className="user_icon">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>
                    {'내정보'}
                  </button>
                </Col>
                <Col xs={6}>
                  <LogoutButton disabled={isMutating} />
                </Col>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Col xs={6}>
                  <button
                    type="button"
                    onClick={() => showModal(loginModalKey)}
                    disabled={isMutating}
                  >
                    <span className="user_icon">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>
                    {'로그인'}
                  </button>
                </Col>
                <Col xs={6}>
                  <button
                    type="button"
                    onClick={() => router.push('/user/register')}
                    disabled={isMutating}
                  >
                    {'회원가입'}
                  </button>
                </Col>
              </>
            )}
          </Row>
        </div>
      </div>
      <LoginModal modalKey={loginModalKey} />
    </>
  );
}
