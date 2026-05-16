import { Container, Row, Col } from 'react-bootstrap';

import { getProductList } from '@/features/product/request/server/model';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  CategoryBtnGroup,
  SortNavGroup,
} from '@/features/product/components/view';
import { ProductCard } from '@/features/product/components/ui';

interface Props {
  params: Promise<{ majorCategoryId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { majorCategoryId } = await params;

  const {
    minerCategoryId = '0',
    limit = '8',
    sort = 'recommended',
  } = await searchParams;

  const queryParams = {
    minerCategoryId: (minerCategoryId ?? '0') as string,
    limit: (limit ?? '8') as string,
    sort: ([
      'recommended',
      'priceAsc',
      'priceDesc',
      'createdAsc',
      'createdDesc',
    ].includes(sort as string)
      ? sort
      : 'recommended') as
      | 'recommended'
      | 'priceAsc'
      | 'priceDesc'
      | 'createdAsc'
      | 'createdDesc',
  };

  const products = await getProductList(majorCategoryId, queryParams);

  if (products.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(products.code, products.message);
  }

  return (
    <div className="coffee_section layout_padding">
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="coffee_taital">
              {products.result.majorCategoryName ?? '카테고리 없음'}
            </h1>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="my-3 justify-content-center">
          <CategoryBtnGroup
            products={products.result}
            currentMinerCategoryId={queryParams.minerCategoryId}
          />
        </Row>
      </Container>
      <div className="coffee_section_2">
        <Container>
          <Row className="my-5 justify-content-end">
            <SortNavGroup currentSort={queryParams.sort} />
          </Row>
          <Row className="my-5 d-flex align-items-stretch">
            {products.result.products.map((product, idx) => (
              <Col lg={3} md={6} className="mb-4 d-flex" key={idx}>
                <ProductCard product={product} isMainPage={false} />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}
