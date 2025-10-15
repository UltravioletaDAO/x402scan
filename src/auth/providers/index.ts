import { env } from '@/env';

import SiweProvider from './siwe/provider';

export const providers = [
  ...(env.NEXT_PUBLIC_CDP_PROJECT_ID ? [SiweProvider()] : []),
];
