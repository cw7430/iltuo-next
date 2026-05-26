'use client';

import { InputGroup, Form } from 'react-bootstrap';

import type { OptionListResponseDto } from '@/features/product/schema';

interface Props {
  options: OptionListResponseDto;
  selectedDetailOptions: string[];
  invalidOptions: string[];
  handleOptionChange: (sortKey: string, selectedId: string) => void;
  getOptionLabel: (option: {
    detailOptionName: string;
    sortKey: string;
    optionType: 'RATE' | 'ABSOLUTE';
    optionValue: bigint;
  }) => string;
}

export default function ProductOptionRow({
  options,
  invalidOptions,
  selectedDetailOptions,
  handleOptionChange,
  getOptionLabel,
}: Props) {
  return (
    <>
      {options.map((option) => (
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
                value={selectedDetailOptions[Number(option.sortKey) - 1] || '0'}
                isInvalid={invalidOptions.includes(option.sortKey)}
              >
                <option value={'0'}>{'==선택=='}</option>
                {option.detailOptions.map((detail) => (
                  <option
                    key={detail.detailOptionId}
                    value={detail.detailOptionId}
                  >
                    {getOptionLabel({
                      detailOptionName: detail.detailOptionName,
                      sortKey: option.sortKey,
                      optionType: option.optionType,
                      optionValue: detail.optionValue,
                    })}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {'옵션을 선택해주세요'}
              </Form.Control.Feedback>
            </InputGroup>
          </td>
        </tr>
      ))}
    </>
  );
}
