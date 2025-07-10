// components/Navbar.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/app/components/Logout/LogoutButton";

type NavLink = { name: string; href: string };
type AuthItem = { name: string; href?: string; type: "link" | "logout" };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  const mainItems: NavLink[] = useMemo(
    () => [
      { name: "Inicio", href: "/" },
      { name: "Ver Carta", href: "/menu" },
    ],
    []
  );

  const authItems: AuthItem[] = useMemo(() => {
    if (isAdmin) {
      return [
        { name: "Panel de administración", href: "/dashboard", type: "link" },
        { name: "Cerrar Sesión", type: "logout" },
      ];
    }
    return [{ name: "Iniciar Sesión", href: "/auth/login", type: "link" }];
  }, [isAdmin]);

  // En móvil solo mainItems + (si es admin) panel/logout, pero nunca "Iniciar Sesión"
  const mobileItems: (NavLink | AuthItem)[] = useMemo(() => {
    if (isAdmin) {
      return [
        ...mainItems,
        ...authItems.filter((it) => it.type === "logout" || it.href !== "/auth/login"),
      ];
    }
    return [...mainItems];
  }, [mainItems, authItems, isAdmin]);

  return (
    <nav className="relative z-50 bg-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex-none">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 select-none"
            priority
          />
        </Link>

        {/* Desktop: mainItems centrados */}
        <div className="hidden flex-1 justify-center gap-x-6 md:flex">
          {mainItems.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:text-amber-600 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop: authItems a la derecha */}
        <div className="hidden items-center md:flex space-x-2">
          {authItems.map((item) =>
            item.type === "logout" ? (
              <LogoutButton key="logout-desktop" />
            ) : (
              <Link
                key={item.name}
                href={item.href!}
                className="text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:text-amber-600 transition"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Botón móvil (solo en móvil) */}
        <button
          aria-label="Abrir navegación"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto flex items-center space-x-2 p-2 bg-amber-600 text-white rounded-md shadow-md hover:bg-amber-700 md:hidden"
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          <span className="font-semibold">Menu</span>
        </button>
      </div>

      {/* Menú móvil (oculto en md+) */}
      <div
        className={`absolute inset-x-0 top-16 bg-white shadow-md md:hidden transition-opacity duration-200 ease-in-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {mobileItems.map((item) =>
          item.type === "logout" ? (
            <div key="logout-mobile" className="px-4 py-3">
              <LogoutButton />
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href!}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:text-amber-600 transition"
            >
              {item.name}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
