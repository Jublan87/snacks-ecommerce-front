import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Stock',
  description: 'Gestionar inventario y stock',
};

export default function StockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
