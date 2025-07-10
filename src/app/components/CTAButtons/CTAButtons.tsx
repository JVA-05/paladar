'use client';
import Link from 'next/link';

export default function CTAButtons() {
  return (
    <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-center md:gap-8">
      <Link href="/menu" className="btn-big">
        Ver menú
      </Link>
    </div>
  );
}
