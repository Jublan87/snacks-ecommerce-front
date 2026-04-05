import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usuarios - Admin',
  description: 'Gestionar usuarios del sistema',
};

export default function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
