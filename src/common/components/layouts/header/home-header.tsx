import { Col, Container, Row } from 'react-bootstrap';

import type { HeaderProps } from './header-props';
import NavGroup from './nav-group';

export default function HomeHeader({ categories }: HeaderProps) {
  return (
    <header className="header_section header_bg">
      <Container>
        <NavGroup categories={categories} />
      </Container>
      <div className="banner_section layout_padding">
        <Container>
          <Row>
            <Col className="md-12">
              <div className="banner_taital_main">
                <h1 className="banner_taital">
                  {'Iltuo'} <br />
                  {'Coffee'}
                </h1>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}
