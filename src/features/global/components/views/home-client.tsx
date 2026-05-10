'use client';

import { Carousel, Col, Container, Row } from 'react-bootstrap';

import { ProductCard } from '@/features/product/components/ui';
import { chunkArray } from '@/common/lib';
import { type RecommendedProductListResponseDto } from '@/features/product/schema';

interface Props {
  recommendedProducts: RecommendedProductListResponseDto;
}

export default function HomeClient({ recommendedProducts }: Props) {
  const products = chunkArray(recommendedProducts, 4);

  return (
    <Carousel id="main_slider" indicators={false}>
      {products.map((group, groupIdx) => (
        <Carousel.Item key={groupIdx}>
          <Container fluid>
            <Row className="justify-content-center align-items-stretch">
              {group.map((item, itemIdx) => (
                <Col
                  lg={3}
                  md={6}
                  sm={12}
                  className="mb-4 d-flex"
                  key={itemIdx}
                >
                  <ProductCard product={item} isMainPage={true} />
                </Col>
              ))}
            </Row>
          </Container>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
