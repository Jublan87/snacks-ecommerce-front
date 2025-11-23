import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Completa tu información de envío y método de pago para finalizar tu compra.',
  openGraph: {
    title: 'Checkout - Snacks Ecommerce',
    description: 'Completa tu información para finalizar tu compra.',
    url: '/checkout',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
