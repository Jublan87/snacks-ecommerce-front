import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description:
    'Inicia sesión en tu cuenta de Snacks Ecommerce para acceder a tus pedidos, direcciones guardadas y más.',
  openGraph: {
    title: 'Iniciar Sesión - Snacks Ecommerce',
    description: 'Inicia sesión en tu cuenta para acceder a tus pedidos y más.',
    url: '/login',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
