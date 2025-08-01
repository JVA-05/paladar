import "@/app/globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import { ImageLoadProvider } from '@/context/ImageLoadContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ranchón la Trocha",
  description: "Experiencia culinaria premium",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.className} h-full bg-amber-50`}>
      <body className="flex min-h-screen flex-col bg-amber-50">
          {/* Navbar con z-index muy alto */}
          <header className="fixed inset-x-0 top-0 h-16 bg-white shadow z-[1000]">
            <Navbar />
          </header>
          <ImageLoadProvider>
          <main className="flex-1 pt-16">{children}</main>
          </ImageLoadProvider>
          <Footer />
      </body>
    </html>
  );
}