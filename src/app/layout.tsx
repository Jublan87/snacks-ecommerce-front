import type { Metadata } from 'next';
import './globals.css';
import { SearchProvider } from '@/shared/contexts/SearchContext';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'Snacks Ecommerce - Tu distribuidor de snacks',
    template: '%s | Snacks Ecommerce',
  },
  description: 'Encuentra los mejores snacks al mejor precio. Amplia variedad de productos, envíos rápidos y los mejores precios del mercado.',
  keywords: ['snacks', 'ecommerce', 'comida', 'golosinas', 'distribuidor', 'venta online'],
  authors: [{ name: 'Snacks Ecommerce' }],
  creator: 'Snacks Ecommerce',
  publisher: 'Snacks Ecommerce',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'Snacks Ecommerce',
    title: 'Snacks Ecommerce - Tu distribuidor de snacks',
    description: 'Encuentra los mejores snacks al mejor precio. Amplia variedad de productos, envíos rápidos y los mejores precios del mercado.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Snacks Ecommerce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snacks Ecommerce - Tu distribuidor de snacks',
    description: 'Encuentra los mejores snacks al mejor precio. Amplia variedad de productos, envíos rápidos y los mejores precios del mercado.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Agregar cuando tengas los códigos de verificación
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
  },
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
