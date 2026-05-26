'use client';

import { useState } from 'react';
import { Table } from 'react-bootstrap';

import type {
  ProductDetailResponseDto,
  ProductResponseDto,
} from '@/features/product/schema';
import BackButton from './back-button';
import QuantityInput from './quantity-input';
import ProductOptionRow from './product-option-row';
import SubmitButton from './submit-button';

interface Props {
  product: ProductDetailResponseDto | ProductResponseDto;
}

export default function ProductDetailForm({ product }: Props) {
  const [totalPrice, setTotalPrice] = useState<bigint>(product.price);
  const [quantity, setQuantity] = useState<bigint>(1n);
  const [selectedDetailOptions, setSelectedDetailOptions] = useState<string[]>(
    [],
  );
  const [invalidOptions, setInvalidOptions] = useState<string[]>([]);

  const hasOptions = 'options' in product;

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

  const updateTotalPrice = (currentQuantity: bigint) => {
    calculateTotalPrice(currentQuantity, selectedDetailOptions);
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

  const validateOptions = () => {
    if (!hasOptions) return true;

    const invalid = product.options
      .filter((opt) => {
        const selectedId = selectedDetailOptions[Number(opt.sortKey) - 1];
        return !selectedId || selectedId === '0';
      })
      .map((opt) => opt.sortKey);

    setInvalidOptions(invalid);
    return invalid.length === 0;
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
              <QuantityInput
                quantity={quantity}
                setQuantity={setQuantity}
                updateTotalPrice={updateTotalPrice}
              />
            </td>
          </tr>
          {hasOptions && (
            <ProductOptionRow
              options={product.options}
              invalidOptions={invalidOptions}
              selectedDetailOptions={selectedDetailOptions}
              handleOptionChange={handleOptionChange}
              getOptionLabel={getOptionLabel}
            />
          )}
          <tr>
            <th scope="row">{'총 상품 가격'}</th>
            <td>{`${totalPrice.toLocaleString()} 원`}</td>
          </tr>
        </tbody>
      </Table>
      <div className="d-flex justify-content-end align-items-center gap-2 mt-5 mb-5">
        <SubmitButton
          method="CART"
          productId={product.productId}
          quantity={quantity}
          options={selectedDetailOptions}
          validateOptions={validateOptions}
        />
        <SubmitButton
          method="ORDER"
          productId={product.productId}
          quantity={quantity}
          options={selectedDetailOptions}
          validateOptions={validateOptions}
        />
        <BackButton />
      </div>
    </>
  );
}
