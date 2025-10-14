import { NextResponse } from 'next/server';

import { env } from '@/env';

import type { NextRequest } from 'next/server';

export const checkCronSecret = (request: NextRequest) => {
  if (env.NEXT_PUBLIC_NODE_ENV === 'development') {
    return;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json(
      {
        success: false as const,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }
};
