import { Col, Container, Row } from 'react-bootstrap';

import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import { initializeRequest } from '@/common/request/server';
import { HomeClient } from '@/features/global/components/views';

export default async function Home() {
  const res = (await initializeRequest()).recommendedProducts;

  if (res.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(res.code, res.message);
  }

  const recommendedProducts = res.result;

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
        <HomeClient recommendedProducts={recommendedProducts} />
      </div>
    </div>
  );
}
