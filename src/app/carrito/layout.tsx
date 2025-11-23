import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras',
  description:
    'Revisa los productos en tu carrito de compras. Modifica cantidades, elimina items y procede al checkout cuando estés listo.',
  openGraph: {
    title: 'Carrito de Compras - Snacks Ecommerce',
    description:
      'Revisa los productos en tu carrito de compras y completa tu pedido.',
    url: '/carrito',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
