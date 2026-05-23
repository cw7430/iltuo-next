import { Col, Container, Row } from 'react-bootstrap';

import { getDetailProduct } from '@/features/product/request/server/model';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import { API_BASE_URL } from '@/common/api/shared/fetch';
import { ProductDetailForm } from '@/features/product/components/view';

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;

  const res = await getDetailProduct(productId);

  if (res.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(res.code, res.message);
  }

  const data = res.result;

  return (
    <Container>
      <Row>
        <Col className="mt-5" md={6}>
          <div>
            <img
              src={`${API_BASE_URL}/files/img/products/${data.fileName}`}
              alt="#"
            />
          </div>
        </Col>
        <Col className="mt-5" md={6}>
          <h2>{data.productName}</h2>
          <h6>{data.productComments}</h6>
          <h5>{`${data.price.toLocaleString()} 원`}</h5>
          <ProductDetailForm product={data} />
        </Col>
      </Row>
    </Container>
  );
}
