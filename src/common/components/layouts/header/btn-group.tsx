'use client';

import { Col, Row } from 'react-bootstrap';

import { useModalState } from '@/features/global/stores';
import { LoginModal } from '@/features/user/components/ui';

export default function BtnGroup() {
  const loginModalKey = 'Login';

  const showModal = useModalState((s) => s.showModal);

  const showLoginModal = () => {
    showModal(loginModalKey);
  };

  return (
    <>
      <div className="form-inline my-2 my-lg-0">
        <div className="login_bt">
          <Row>
            <Col xs={6}>
              <button type="button" onClick={showLoginModal}>
                <span className="user_icon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
                {'로그인'}
              </button>
            </Col>
            <Col xs={6}>
              <button type="button">{'회원가입'}</button>
            </Col>
          </Row>
        </div>
      </div>
      <LoginModal modalKey={loginModalKey} />
    </>
  );
}
