'use client';

import { Alert, Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    router.replace('/');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <Card
        style={{ width: '100%', maxWidth: '500px' }}
        className="text-center shadow-lg"
      >
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>404 Not Found</Alert.Heading>
            <p>페이지가 존재하지 않습니다.</p>
          </Alert>
          <Button variant="primary" onClick={goBack}>
            홈으로
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
