import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirmación de Pedido',
  description:
    'Tu pedido ha sido confirmado exitosamente. Revisa los detalles de tu compra y el número de orden.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfirmacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
