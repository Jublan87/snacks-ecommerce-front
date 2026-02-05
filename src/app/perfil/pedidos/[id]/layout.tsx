import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle del Pedido',
  description:
    'Revisa los detalles completos de tu pedido, incluyendo productos, dirección de envío y método de pago.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
