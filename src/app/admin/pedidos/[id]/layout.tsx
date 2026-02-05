import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Pedido | Admin',
  description: 'Detalle y gestión del pedido',
  robots: { index: false, follow: false },
};

export default function AdminOrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
