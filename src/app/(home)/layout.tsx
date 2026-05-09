import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

import { getCategories } from '@/features/global/request/server/models';

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  if (categories.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(categories.code, categories.message);
  }

  return <>{children}</>;
}
