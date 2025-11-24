import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Stock',
  description: 'Gestionar inventario y stock',
};

export default function AdminStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Control de Stock</h1>
        <p className="text-gray-600 mt-1">
          Administra el inventario de productos
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          Esta sección se implementará en el hito 6.4
        </p>
      </div>
    </div>
  );
}

