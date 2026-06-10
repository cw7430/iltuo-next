'use client';

import { type UseFormSetValue } from 'react-hook-form';
import { useKakaoPostcodePopup, type Address } from 'react-daum-postcode';
import { Button } from 'react-bootstrap';

import type { AddressRequestDto } from '@/features/user/schema';

interface Props {
  setValue: UseFormSetValue<AddressRequestDto>;
}

export default function PostCodeButton({ setValue }: Props) {
  const open = useKakaoPostcodePopup();

  const handleComplete = (data: Address) => {
    const postalCode = data.zonecode;
    let defaultAddress = '';
    let extraAddress = '';

    if (data.userSelectedType === 'R') {
      defaultAddress = data.roadAddress;
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddress +=
          extraAddress !== '' ? ', ' + data.buildingName : data.buildingName;
      }
      if (extraAddress !== '') {
        extraAddress = '(' + extraAddress + ')';
      } else {
        defaultAddress = data.jibunAddress;
      }
    }

    setValue('postalCode', postalCode);
    setValue('defaultAddress', defaultAddress);
    setValue('extraAddress', extraAddress);
  };

  const onClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <Button variant="secondary" type="button" onClick={onClick}>
      {'주소 검색'}
    </Button>
  );
}
