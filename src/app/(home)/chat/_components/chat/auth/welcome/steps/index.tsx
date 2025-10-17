import { BotMessageSquare, DollarSign, Pen, Wallet } from 'lucide-react';

import { Verify } from './verify';
import { CreateWallet } from './create-wallet';

import type { WelcomeStep } from './types';
import { FundWallet } from './fund-wallet';

export const welcomeSteps: WelcomeStep[] = [
  {
    icon: <Wallet className="size-4" />,
    title: 'Connect Wallet',
    component: null,
  },
  {
    icon: <Pen className="size-4" />,
    title: 'Verify Wallet',
    component: <Verify />,
  },
  {
    icon: <BotMessageSquare className="size-4" />,
    title: 'Create Agent Wallet',
    component: <CreateWallet />,
  },
  {
    icon: <DollarSign className="size-4" />,
    title: 'Fund Wallet',
    component: <FundWallet />,
  },
];
