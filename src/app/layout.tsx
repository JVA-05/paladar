// app/layout.tsx
import "@/app/globals.css";                   // tus estilos globales
import "leaflet/dist/leaflet.css";            // estilos de Leaflet
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ranchón la Trocha",
  description: "Experiencia culinaria premium",
  viewport: "width=device-width, initial-scale=1",  // asegura responsive
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.className} h-full bg-amber-50`}>
      <body className="flex min-h-screen flex-col bg-amber-50">
          {/* Header fijo de 4rem (h-16) */}
          <header className="fixed inset-x-0 top-0 h-16 bg-white shadow z-50">
            <Navbar />
          </header>
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
