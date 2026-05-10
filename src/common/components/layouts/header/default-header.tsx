import { Container } from 'react-bootstrap';

import type { HeaderProps } from './header-props';
import NavGroup from './nav-group';

export default function DefaultHeader({ categories }: HeaderProps) {
  return (
    <header className="header_section header_bg">
      <Container>
        <NavGroup categories={categories} />
      </Container>
    </header>
  );
}
