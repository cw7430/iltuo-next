import { cache } from 'react';

import { getCategories } from '@/features/global/request/server/models';
import { getRecommendedProducts } from '@/features/product/request/server/model';

export const initializeRequest = cache(async () => {
  return {
    categories: await getCategories(),
    recommendedProducts: await getRecommendedProducts(),
  };
});
