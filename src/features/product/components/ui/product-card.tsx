'use client';

import Link from 'next/link';
import { Card } from 'react-bootstrap';

import type { ProductResponseDto } from '@/features/product/schema';

interface Props {
  product: ProductResponseDto;
  isMainPage?: boolean;
}

export default function ProductCard({ product, isMainPage = false }: Props) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  return (
    <Card
      className="w-100"
      as={Link}
      href={`/product/detail/${product.productId}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="coffee_img">
        <img
          src={`${API_BASE_URL}/files/img/products/${product.fileName}`}
          alt="#"
        />
      </div>
      <Card.Body className="coffee_box d-flex flex-column flex-grow-1">
        <Card.Title className="types_text">{product.productName}</Card.Title>
        <Card.Text className="looking_text flex-grow-1">
          {isMainPage
            ? product.productComments || '\u00A0'
            : product.productComments}
        </Card.Text>
        <div className="types_text">{product.price.toLocaleString()}</div>
      </Card.Body>
    </Card>
  );
}
