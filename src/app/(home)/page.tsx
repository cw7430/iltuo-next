import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

import { getRecommendedProducts } from '@/features/product/request/server/model';

export default async function Home() {
  const recommendedProducts = await getRecommendedProducts();

  if (recommendedProducts.code != ResponseCode.SUCCESS.code) {
    throw new ApiError(recommendedProducts.code, recommendedProducts.message);
  }

  return (
    <div>
      <div></div>
    </div>
  );
}
