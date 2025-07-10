'use client';

import Image from 'next/image';
import Link from 'next/link';

const socials = [
  {
    href: 'https://wa.me/5356441187',
    src: '/img/whatsapp-logo.png',
    alt: 'WhatsApp',
    label: '+53 5644 1187',
  },
  {
    href: 'https://facebook.com/tupaladar',
    src: '/img/facebook-logo.png',
    alt: 'Facebook',
    label: '@tupaladar',
  },
  {
    href: 'https://instagram.com/InstagramPaladar',
    src: '/img/instagram-logo.png',
    alt: 'Instagram',
    label: '@InstagramPaladar',
  },
];

export default function Footer() {
  return (
    <footer className="bg-amber-600 text-amber-50 text-sm">
      {/* bloque principal: móvil apila, escritorio fila */}
      <div
        className="
          mx-auto max-w-7xl px-4 py-6
          flex flex-col items-center space-y-6
          md:flex-row md:justify-evenly md:items-center md:space-y-0
        "
      >
        {/* Dirección */}
        <address className="not-italic text-center md:text-left leading-tight">
          <p className="font-semibold uppercase tracking-wide text-[0.75rem] md:text-sm">
            Visítenos
          </p>
          Calle José A. Echavarría<br />
          Entre Máximo Gómez y Bembeta&nbsp;129 alto
        </address>

        {/* Redes y teléfono */}
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {socials.map(({ href, src, alt, label }) => (
            <li key={alt}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-2
                  focus:outline-none focus:ring-2 focus:ring-white/70
                  rounded
                "
              >
                <Image
                  src={src}
                  alt={alt}
                  width={32}
                  height={32}
                  className="
                    h-8 w-8 rounded shadow-sm
                    transition-transform duration-200
                    group-hover:scale-110
                  "
                />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* línea inferior */}
      <div className="border-t border-amber-300/30 py-4 text-center text-xs">
        © {new Date().getFullYear()} La Loma. Todos los derechos reservados.
      </div>
    </footer>
  );
}
