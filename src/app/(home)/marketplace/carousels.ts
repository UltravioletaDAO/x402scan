import {
  TrendingUp,
  Calendar,
  Clock,
  Search,
  Coins,
  Brain,
  ChartCandlestick,
} from 'lucide-react';

import type { RouterInputs } from '@/trpc/client';
import type { LucideIcon } from 'lucide-react';

type MarketplaceCarousel = {
  sectionProps: {
    title: string;
    Icon: LucideIcon;
  };
  input: RouterInputs['public']['sellers']['list']['bazaar'];
  hideCount?: boolean;
};

export const MARKETPLACE_CAROUSELS: MarketplaceCarousel[] = [
  {
    sectionProps: {
      title: 'Most Used',
      Icon: TrendingUp,
    },
    input: {
      pagination: {
        page_size: 20,
      },
    },
  },
  {
    sectionProps: {
      title: 'Oldest',
      Icon: Calendar,
    },
    input: {
      sorting: {
        id: 'first_block_timestamp',
        desc: false,
      },
      pagination: {
        page_size: 20,
      },
    },
    hideCount: true,
  },
  {
    sectionProps: {
      title: 'Newest',
      Icon: Clock,
    },
    input: {
      sorting: {
        id: 'first_block_timestamp',
        desc: true,
      },
      pagination: {
        page_size: 20,
      },
    },
    hideCount: true,
  },
  {
    sectionProps: {
      title: 'Search Servers',
      Icon: Search,
    },
    input: {
      tags: ['Search'],
      pagination: {
        page_size: 20,
      },
    },
  },
  {
    sectionProps: {
      title: 'Crypto Servers',
      Icon: Coins,
    },
    input: {
      tags: ['Crypto'],
      pagination: {
        page_size: 20,
      },
    },
  },
  {
    sectionProps: {
      title: 'AI Servers',
      Icon: Brain,
    },
    input: {
      tags: ['Utility'],
      pagination: {
        page_size: 20,
      },
    },
  },
  {
    sectionProps: {
      title: 'Trading Servers',
      Icon: ChartCandlestick,
    },
    input: {
      tags: ['Trading'],
      pagination: {
        page_size: 20,
      },
    },
  },
];
