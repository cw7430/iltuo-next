'use client';

import { useEffect } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
            <Alert.Heading>에러</Alert.Heading>
            <p>
              네트워크 상태를 확인하거나, 아래 버튼을 눌러 다시 시도해주세요.
            </p>
          </Alert>

          <Button variant="primary" onClick={() => reset()}>
            다시 시도
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
