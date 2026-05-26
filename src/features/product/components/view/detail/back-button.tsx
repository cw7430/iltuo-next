'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'react-bootstrap';

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const history = searchParams.get('history');

  const isHome = history === '/';

  const safeHistory =
    history &&
    !history.startsWith('//') &&
    !history.startsWith('/product/detail') &&
    (isHome || history.startsWith('/product'))
      ? history
      : null;

  const goBack = () => {
    if (safeHistory) {
      router.push(safeHistory);
      return;
    }

    router.push('/');
  };

  return (
    <Button variant="info" onClick={goBack}>
      {isHome ? '홈으로' : '목록으로'}
    </Button>
  );
}
