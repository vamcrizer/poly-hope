export type Signal = {
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  timeframe: string;
  generated_at: string;
};

export type SignalsResponse = {
  signals: Signal[];
  generated_at: string;
};

export type User = {
  id: number;
  email: string;
  created_at: string;
};

export type Subscription = {
  id: number;
  user_id: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'basic' | 'pro' | 'api';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  current_period_end: string | null;
  created_at: string;
};

export type JWTPayload = {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
};

export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export type Plan = 'basic' | 'pro' | 'api';

export const PLAN_PRICES: Record<Plan, { monthly: number; label: string; description: string }> = {
  basic: { monthly: 19, label: 'Basic', description: '5 assets, daily signals' },
  pro: { monthly: 39, label: 'Pro', description: 'All assets + email alerts' },
  api: { monthly: 99, label: 'API', description: 'REST API access + webhooks' },
};
