import { Container, Row } from 'react-bootstrap';

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { productId } = await params;

  return (
    <Container>
      <Row></Row>
    </Container>
  );
}
