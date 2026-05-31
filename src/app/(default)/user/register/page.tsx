import { Col, Container, Row } from 'react-bootstrap';

import { RegisterForm } from '@/features/user/components/view';

export default function RegisterPage() {
  return (
    <div className="coffee_section layout_padding">
      <Container style={{ maxWidth: '800px' }}>
        <Row>
          <Col md={12}>
            <h1 className="coffee_taital">{'회원가입'}</h1>
          </Col>
        </Row>
      </Container>
      <Container className="py-5" style={{ maxWidth: '800px' }}>
        <Row className="text-end">
          <Col className="mb-3">{'* 필수입력사항'}</Col>
        </Row>
        <RegisterForm />
      </Container>
    </div>
  );
}
