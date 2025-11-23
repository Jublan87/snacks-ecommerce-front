import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Pedidos',
  description:
    'Revisa el historial de tus pedidos, estado de envío y detalles de cada compra realizada.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
