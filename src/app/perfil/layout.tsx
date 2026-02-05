import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil',
  description: 'Gestiona tu información personal, direcciones de envío y configuración de cuenta.',
  openGraph: {
    title: 'Mi Perfil - Snacks Ecommerce',
    description: 'Gestiona tu información personal y configuración de cuenta.',
    url: '/perfil',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

