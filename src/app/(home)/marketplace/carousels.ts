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
    description?: string;
    Icon: LucideIcon;
  };
  input: RouterInputs['public']['sellers']['list']['bazaar'];
  hideCount?: boolean;
};

export const MARKETPLACE_CAROUSELS: MarketplaceCarousel[] = [
  {
    sectionProps: {
      title: 'Most Used',
      description: 'Ranked by number of successful requests',
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
      title: 'Newest',
      description: 'Servers that most recently received their first request',
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
      description: 'Servers that provide resources for searching the web',
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
      description: 'Servers that provide resources for crypto operations',
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
      description: 'Servers that provide AI resources',
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
      description: 'Servers that provide resources for trading information',
      Icon: ChartCandlestick,
    },
    input: {
      tags: ['Trading'],
      pagination: {
        page_size: 20,
      },
    },
  },
  {
    sectionProps: {
      title: 'Oldest',
      description: 'Servers that have been around the longest',
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
];
