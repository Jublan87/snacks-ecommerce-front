import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Home, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description:
    'La página que buscas no existe. Regresa al inicio para seguir navegando por nuestros productos.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-6">
          <Package className="w-24 h-24 text-gray-400 mx-auto" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
