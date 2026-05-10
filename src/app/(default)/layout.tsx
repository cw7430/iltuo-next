import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

import { initializeRequest } from '@/common/request/server';
import { DefaultHeader, Footer } from '@/common/components/layouts';

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = (await initializeRequest()).categories;

  if (categories.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(categories.code, categories.message);
  }

  return (
    <>
      <DefaultHeader categories={categories.result} />
      {children}
      <Footer />
    </>
  );
}
