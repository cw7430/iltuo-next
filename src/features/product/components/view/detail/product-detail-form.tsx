'use client';

import { useState } from 'react';
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
  const [selectedDetailOptions, setSelectedDetailOptions] = useState<string[]>(
    [],
  );
  const [quantity, setQuantity] = useState<bigint>(1n);

  const hasOptions = 'options' in product;

  const updateTotalPrice = (currentQuantity: bigint) => {
    calculateTotalPrice(currentQuantity, selectedDetailOptions);
  };

  const sanitizeQuantity = (value: number) => {
    if (isNaN(value) || value <= 0) return 1n;
    if (value > 99) return 99n;
    return BigInt(value);
  };

  const handleQuantityFormat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = event.target.value.replace(/[^0-9]/g, '');
    const rawNumber = Number(formattedValue || '1');
    const sanitized = sanitizeQuantity(rawNumber);

    setQuantity(sanitized);
    updateTotalPrice(sanitized);
  };

  const handleQuantityBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const rawNumber = Number(event.target.value);
    const sanitized = sanitizeQuantity(rawNumber);

    setQuantity(sanitized);
    updateTotalPrice(sanitized);
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

  const calculateTotalPrice = (
    quantity: bigint,
    selectedOptionIds: string[],
  ) => {
    let price = product.price * quantity;

    if (hasOptions && detailOptionMap) {
      selectedOptionIds.forEach((id) => {
        const option = detailOptionMap.get(id);
        if (!option) return;
        price = applyOptionPrice(price, {
          optionType: option.optionType,
          optionValue: option.optionValue,
        });
      });
    }

    setTotalPrice(price);
  };

  const getOptionLabel = (option: {
    detailOptionName: string;
    sortKey: string;
    optionType: 'RATE' | 'ABSOLUTE';
    optionValue: bigint;
  }) => {
    let price = product.price * quantity;

    if (hasOptions && detailOptionMap) {
      selectedDetailOptions.forEach((id, idx) => {
        const opt = detailOptionMap.get(id);
        if (!opt || idx + 1 >= Number(option.sortKey)) return;
        price = applyOptionPrice(price, opt);
      });
    }

    const delta = getOptionDelta(price, option);
    return `${option.detailOptionName} (${formatPriceDelta(delta)})`;
  };

  const handleOptionChange = (sortKey: string, selectedId: string) => {
    const idx = Number(sortKey);

    const newDetailOptions = [...selectedDetailOptions];

    if (selectedId === '0') {
      const truncated = newDetailOptions.slice(0, idx - 1);
      setSelectedDetailOptions(truncated);
      calculateTotalPrice(quantity, truncated);
      return;
    }

    newDetailOptions[idx - 1] = selectedId;
    const truncated = newDetailOptions.slice(0, idx);
    setSelectedDetailOptions(truncated);
    calculateTotalPrice(quantity, truncated);
  };

  const detailOptionMap = hasOptions
    ? new Map(
        product.options
          .flatMap((opt) =>
            opt.detailOptions.map((dopt) => ({
              ...dopt,
              optionType: opt.optionType,
              sortKey: opt.sortKey,
            })),
          )
          .map((opt) => [opt.detailOptionId, opt]),
      )
    : undefined;

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
                  value={quantity.toString()}
                  min={1}
                  max={99}
                  onChange={handleQuantityFormat}
                  onBlur={handleQuantityBlur}
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
                          : !selectedDetailOptions[Number(option.sortKey) - 2]
                      }
                      onChange={(e) =>
                        handleOptionChange(option.sortKey, e.target.value)
                      }
                      value={
                        selectedDetailOptions[Number(option.sortKey) - 1] || '0'
                      }
                    >
                      <option value={'0'}>{'==선택=='}</option>
                      {option.detailOptions.map((detail, idx) => (
                        <option key={idx} value={detail.detailOptionId}>
                          {getOptionLabel({
                            detailOptionName: detail.detailOptionName,
                            sortKey: option.sortKey,
                            optionType: option.optionType,
                            optionValue: detail.optionValue,
                          })}
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
