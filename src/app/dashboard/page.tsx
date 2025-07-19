import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // en cuanto se solicite /dashboard, Next.js hará server-side redirect
  redirect('/dashboard/platos');
}