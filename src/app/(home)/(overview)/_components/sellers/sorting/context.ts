'use client';

import { createSortingContext } from '@/app/_contexts/sorting/context';

import type { SellerSortId } from '@/services/cdp/sql/sellers/list';

export const SellersSortingContext = createSortingContext<SellerSortId>();
