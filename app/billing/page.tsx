import { redirect } from 'next/navigation';

// Convenience redirect — links and Stripe portal return_url both use /billing
export default function BillingPage() {
  redirect('/account');
}
