import { Metadata } from 'next';
import AdminLayoutClient from '@/features/admin/components/AdminLayoutClient';
import ProtectedAdminRoute from '@/features/admin/components/ProtectedAdminRoute';

export const metadata: Metadata = {
  title: 'Panel de Administración',
  description: 'Panel de administración del ecommerce de snacks',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedAdminRoute>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ProtectedAdminRoute>
  );
}

