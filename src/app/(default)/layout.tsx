import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

import { initializeRequest } from '@/common/request/server';
import { DefaultHeader, Footer } from '@/common/components/layouts';

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = (await initializeRequest()).categories;

  if (res.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(res.code, res.message);
  }

  const categories = res.result;

  return (
    <>
      <DefaultHeader categories={categories} />
      {children}
      <Footer />
    </>
  );
}
