'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';

import type {
  ProductDetailResponseDto,
  ProductResponseDto,
} from '@/features/product/schema';
import ProductDetailBackButton from './product-detail-back-button';

interface Props {
  product: ProductDetailResponseDto | ProductResponseDto;
}

export default function ProductDetailForm({ product }: Props) {
  const router = useRouter();

  const [totalPrice, setTotalPrice] = useState<bigint>(product.price);
  const [detailOptions, setDetailOptions] = useState<string[]>([]);

  const quantityRef = useRef<HTMLInputElement>(null);

  const hasOptions = 'options' in product;

  const getQuantity = () => {
    const input = quantityRef.current;
    if (!input) return 1;

    const value = Number(input.value);
    if (isNaN(value) || value <= 0) return 1;
    if (value > 99) return 99;
    return BigInt(value);
  };

  const getOptionDelta = (
    basePrice: bigint,
    option: { optionType: 'RATE' | 'ABSOLUTE'; optionValue: bigint },
  ) => {
    if (option.optionType === 'ABSOLUTE') {
      return option.optionValue;
    }

    const percentage = option.optionValue - 100n;

    return ((basePrice * percentage) / 100n / 10n) * 10n;
  };

  const applyOptionPrice = (
    basePrice: bigint,
    option: { optionType: 'RATE' | 'ABSOLUTE'; optionValue: bigint },
  ) => {
    return basePrice + getOptionDelta(basePrice, option);
  };

  const formatPriceDelta = (delta: bigint) => {
    const prefix = delta >= 0n ? '+' : '-';
    const absolute = delta < 0n ? -delta : delta;

    return `${prefix}${absolute.toLocaleString()}원`;
  };

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
          {hasOptions &&
            product.options.map((option) => (
              <tr key={option.sortKey}>
                <th scope="row">{option.optionName}</th>
                <td>
                  <InputGroup
                    style={{
                      maxWidth: '450px',
                    }}
                  >
                    <Form.Select
                      disabled={
                        option.sortKey === '1'
                          ? false
                          : !detailOptions[Number(option.sortKey) - 2]
                      }
                    >
                      <option value={'0'}>{'==선택=='}</option>
                      {option.detailOptions.map((detail, idx) => (
                        <option key={idx} value={detail.detailOptionId}>
                          {detail.detailOptionName}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </td>
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
        <ProductDetailBackButton />
      </div>
    </>
  );
}
