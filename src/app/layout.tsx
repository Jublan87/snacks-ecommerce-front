import type { Metadata } from 'next';
import './globals.css';
import { SearchProvider } from '@/contexts/SearchContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Snacks Ecommerce - Tu distribuidor de snacks',
  description: 'Encuentra los mejores snacks al mejor precio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen">
        <SearchProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
