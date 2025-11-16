import type { Metadata } from 'next';
import './globals.css';
import { SearchProvider } from '@/shared/contexts/SearchContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

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
          {/* Toaster: Muestra notificaciones en la esquina superior derecha
              richColors: Activa colores más vibrantes para los mensajes
              closeButton: Muestra un botón X para cerrar el toast
              offset: Mueve el toast hacia abajo para no tapar el icono del carrito (80px desde arriba) */}
          <Toaster position="top-right" richColors closeButton offset="80px" />
        </SearchProvider>
      </body>
    </html>
  );
}
