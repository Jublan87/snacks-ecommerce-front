import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Productos',
  description: 'Gestionar productos del catálogo',
};

export default function AdminProductosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
        <p className="text-gray-600 mt-1">
          Administra el catálogo de productos
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          Esta sección se implementará en el hito 6.2
        </p>
      </div>
    </div>
  );
}

