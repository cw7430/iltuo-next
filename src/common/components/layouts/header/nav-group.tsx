'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsMutating } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';
import { Nav, Navbar } from 'react-bootstrap';

import type { HeaderProps } from './header-props';
import { useAuthStore, validateAuthIntegrity } from '@/features/user/stores';
import BtnGroup from './btn-group';

export default function NavGroup({ categories }: HeaderProps) {
  const pathname = usePathname();

  const isUserMutating = useIsMutating() > 0;

  const { isLoggedIn } = useAuthStore(
    useShallow((s) => ({
      isLoggedIn: validateAuthIntegrity(s),
    })),
  );

  return (
    <Navbar expand="lg">
      <Navbar.Brand as={Link} href="/">
        <img src="/img/logo.png" alt="Iltuo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link
            as={Link}
            href="/"
            active={pathname === '/'}
            disabled={isUserMutating}
          >
            {'홈'}
          </Nav.Link>
          {categories.map((category) => {
            const path = `/product/${category.majorCategoryId}`;

            return (
              <Nav.Link
                key={category.majorCategoryId}
                as={Link}
                href={path}
                active={pathname === path}
                disabled={isUserMutating}
              >
                {category.majorCategoryName}
              </Nav.Link>
            );
          })}
          <Nav.Link
            as={Link}
            href="/"
            disabled={!isLoggedIn || isUserMutating}
            hidden={!isLoggedIn}
          >
            {'주문내역'}
          </Nav.Link>

          <Nav.Link
            as={Link}
            href="/"
            disabled={!isLoggedIn || isUserMutating}
            hidden={!isLoggedIn}
          >
            {'장바구니'}
          </Nav.Link>
        </Nav>
        <BtnGroup />
      </Navbar.Collapse>
    </Navbar>
  );
}
