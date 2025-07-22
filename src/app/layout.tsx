import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ranchón la Trocha',
  description: 'Experiencia culinaria premium',
  verification: {
    google: 'adKAiLXS7UlsBBX0QLL5q6OYKu8Rrm2KrVuM5Jcetz0'
  }
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.className} h-full bg-amber-50`}
    >
      <body className="flex min-h-screen flex-col bg-amber-50">
        <AuthProvider>
          {/* Header fijo de 4rem (h-16) */}
          <header className="fixed inset-x-0 top-0 h-16 bg-white shadow z-50">
            <Navbar />
          </header>

          {/* Empuja todo el contenido 4rem hacia abajo */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
