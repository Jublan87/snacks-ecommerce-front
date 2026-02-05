import { Metadata } from 'next';
import AdminDashboard from '@features/admin/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard del panel de administración',
};

export default function AdminPage() {
  return <AdminDashboard />;
}

