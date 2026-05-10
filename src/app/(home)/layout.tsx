import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

import { initializeRequest } from '@/common/request/server';
import { Footer, HomeHeader } from '@/common/components/layouts';

export default async function HomeLayout({
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
      <HomeHeader categories={categories.result} />
      {children}
      <Footer />
    </>
  );
}
