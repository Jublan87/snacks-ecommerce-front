import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Cuenta',
  description:
    'Crea tu cuenta en Snacks Ecommerce y disfruta de envíos rápidos, mejores precios y acceso a ofertas exclusivas.',
  openGraph: {
    title: 'Crear Cuenta - Snacks Ecommerce',
    description:
      'Crea tu cuenta y disfruta de envíos rápidos y mejores precios.',
    url: '/registro',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
