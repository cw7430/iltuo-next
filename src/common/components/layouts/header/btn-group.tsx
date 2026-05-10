'use client';

import { Col, Row } from 'react-bootstrap';

export default function BtnGroup() {
  return (
    <div className="form-inline my-2 my-lg-0">
      <div className="login_bt">
        <Row>
          <Col xs={6}>
            <button type="button">
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
  );
}
