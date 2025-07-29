"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

type NavLink = { name: string; href: string };

export default function Navbar() {
  const mainItems: NavLink[] = useMemo(
    () => [
      { name: "Inicio", href: "/" },
      { name: "Ver Carta", href: "/menu" },
    ],
    []
  );

  return (
    <nav className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white">
      {/* Logo */}
      <Link href="/" className="flex-none">
        <Image
          src="/img/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="select-none"
          priority
        />
      </Link>

      {/* Enlaces – siempre visibles */}
      <div className="flex flex-1 justify-center gap-x-6">
        {mainItems.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-base sm:text-lg font-bold text-gray-900 hover:text-amber-600 transition"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}