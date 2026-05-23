'use client';

import { useRef, useState } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';

import type {
  ProductDetailResponseDto,
  ProductResponseDto,
} from '@/features/product/schema';

interface Props {
  product: ProductDetailResponseDto | ProductResponseDto;
}

export default function ProductDetailForm({ product }: Props) {
  const [totalPrice, setTotalPrice] = useState<bigint>(product.price);

  const quantityRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Table>
        <tbody>
          <tr>
            <th scope="row" style={{ width: '100px' }}>
              {'수량'}
            </th>
            <td>
              <InputGroup style={{ width: '80px' }}>
                <Form.Control
                  type="number"
                  ref={quantityRef}
                  defaultValue={1}
                  min={1}
                  max={99}
                />
              </InputGroup>
            </td>
          </tr>
          {'options' in product &&
            product.options.map((option) => (
              <tr key={option.sortKey}>
                <th scope="row">{option.optionName}</th>
                <td></td>
              </tr>
            ))}
          <tr>
            <th scope="row">{'총 상품 가격'}</th>
            <td>{`${totalPrice.toLocaleString()} 원`}</td>
          </tr>
        </tbody>
      </Table>
      <div className="d-flex justify-content-end align-items-center gap-2 mt-5 mb-5">
        <Button variant="primary">{'장바구니'}</Button>
        <Button variant="danger">{'바로구매'}</Button>
        <Button variant="info">{'목록으로'}</Button>
      </div>
    </>
  );
}
