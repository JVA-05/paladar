// app/dashboard/layout.tsx
'use client';                    // <<< esto

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedAdmin from '@/app/components/ProtectedAdmin/ProtectedAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { label: 'Platos',       href: '/dashboard/platos' },
    { label: 'Subcategorías', href: '/dashboard/subcategorias' },
    { label: 'Categorías',    href: '/dashboard/categorias' },
    { label: 'Métricas',      href: '/dashboard/metricas' },
  ];

  return (
    <ProtectedAdmin>
      <div className="flex h-full flex-col">
        <nav className="bg-white border-b px-6 py-3 flex gap-4">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1 rounded ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </ProtectedAdmin>
  );
}
