'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Col, Nav } from 'react-bootstrap';

interface Props {
  currentSort:
    | 'recommended'
    | 'priceAsc'
    | 'priceDesc'
    | 'createdAsc'
    | 'createdDesc';
}

export default function SortNavGroup({ currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClick = (
    sort:
      | 'recommended'
      | 'priceAsc'
      | 'priceDesc'
      | 'createdAsc'
      | 'createdDesc',
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Col xs="auto" className="d-flex">
        <Nav.Link
          as="button"
          disabled={currentSort === 'recommended'}
          onClick={() => onClick('recommended')}
          style={{
            fontWeight: currentSort === 'recommended' ? 'bold' : 'normal',
          }}
        >
          {'추천순'}
        </Nav.Link>
      </Col>
      <Col xs="auto" className="d-flex">
        <Nav.Link
          as="button"
          disabled={currentSort === 'createdDesc'}
          onClick={() => onClick('createdDesc')}
          style={{
            fontWeight: currentSort === 'createdDesc' ? 'bold' : 'normal',
          }}
        >
          {'최신순'}
        </Nav.Link>
      </Col>
      <Col xs="auto" className="d-flex">
        <Nav.Link
          as="button"
          disabled={currentSort === 'priceAsc'}
          onClick={() => onClick('priceAsc')}
          style={{
            fontWeight: currentSort === 'priceAsc' ? 'bold' : 'normal',
          }}
        >
          {'낮은가격순'}
        </Nav.Link>
      </Col>
      <Col xs="auto" className="d-flex">
        <Nav.Link
          as="button"
          disabled={currentSort === 'priceDesc'}
          onClick={() => onClick('priceDesc')}
          style={{
            fontWeight: currentSort === 'priceDesc' ? 'bold' : 'normal',
          }}
        >
          {'높은가격순'}
        </Nav.Link>
      </Col>
    </>
  );
}
