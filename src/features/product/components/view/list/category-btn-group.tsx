'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Col, Button } from 'react-bootstrap';

import { type ProductListResponseDto } from '@/features/product/schema';

interface Props {
  products: ProductListResponseDto;
  currentMinerCategoryId: string;
}

export default function CategoryBtnGroup({
  products,
  currentMinerCategoryId,
}: Props) {
  const { minerCategories } = products;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClick = (minerCategoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('minerCategoryId', minerCategoryId.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Col xs="auto">
        <Button
          variant="outline-secondary"
          active={currentMinerCategoryId === '0'}
          onClick={() => onClick('0')}
        >
          {'전체'}
        </Button>
      </Col>
      {minerCategories.map((category) => (
        <Col xs="auto" key={category.sortKey}>
          <Button
            variant="outline-secondary"
            active={currentMinerCategoryId === category.minerCategoryId}
            onClick={() => onClick(category.minerCategoryId)}
          >
            {category.minerCategoryName}
          </Button>
        </Col>
      ))}
    </>
  );
}
