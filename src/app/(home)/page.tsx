import { Col, Container, Row } from 'react-bootstrap';

import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import { initializeRequest } from '@/common/request/server';
import { HomeClient } from '@/features/global/components/views';

export default async function Home() {
  const recommendedProducts = (await initializeRequest()).recommendedProducts;

  if (recommendedProducts.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(recommendedProducts.code, recommendedProducts.message);
  }

  return (
    <div className="coffee_section layout_padding">
      <Container>
        <Row>
          <Col md={12}>
            <h1 className="coffee_taital">추천상품</h1>
          </Col>
        </Row>
      </Container>
      <div className="coffee_section_2">
        <HomeClient recommendedProducts={recommendedProducts.result} />
      </div>
    </div>
  );
}
