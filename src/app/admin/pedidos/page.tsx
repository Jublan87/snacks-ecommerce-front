import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Pedidos',
  description: 'Gestionar pedidos de clientes',
};

export default function AdminPedidosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-1">
          Administra los pedidos de los clientes
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          Esta sección se implementará en el hito 6.3
        </p>
      </div>
    </div>
  );
}

