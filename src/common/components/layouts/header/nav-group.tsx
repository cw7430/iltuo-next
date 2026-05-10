'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav, Navbar } from 'react-bootstrap';

import type { HeaderProps } from './header-props';
import BtnGroup from './btn-group';

export default function NavGroup({ categories }: HeaderProps) {
  const pathname = usePathname();

  return (
    <Navbar expand="lg">
      <Navbar.Brand as={Link} href="/">
        <img src="/img/logo.png" alt="Iltuo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} href="/" active={pathname === '/'}>
            {'홈'}
          </Nav.Link>
          {categories.map((category) => {
            const path = `/products/${category.majorCategoryId}`;

            return (
              <Nav.Link
                key={category.majorCategoryId}
                as={Link}
                href={path}
                active={pathname === path}
              >
                {category.majorCategoryName}
              </Nav.Link>
            );
          })}
        </Nav>
        <BtnGroup />
      </Navbar.Collapse>
    </Navbar>
  );
}
