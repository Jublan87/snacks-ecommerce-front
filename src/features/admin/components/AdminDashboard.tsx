'use client';

import { Card } from '@shared/ui/card';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

/**
 * Dashboard principal del panel de administración
 * Muestra métricas básicas y resumen general
 */
export default function AdminDashboard() {
  // TODO: Conectar con datos reales cuando tengamos backend
  // Por ahora mostramos datos mock
  const metrics = [
    {
      title: 'Total de Productos',
      value: '0',
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Pedidos del Mes',
      value: '0',
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Ingresos del Mes',
      value: '$0',
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
    },
    {
      title: 'Total de Clientes',
      value: '0',
      icon: Users,
      color: 'bg-purple-500',
      change: '+5%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen general del negocio
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {metric.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {metric.change} vs mes anterior
                  </p>
                </div>
                <div
                  className={`${metric.color} p-3 rounded-lg text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sección de acciones rápidas */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/productos"
            className="p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Gestionar Productos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Agregar, editar o eliminar productos
            </p>
          </a>
          <a
            href="/admin/pedidos"
            className="p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Ver Pedidos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Revisar y gestionar pedidos
            </p>
          </a>
          <a
            href="/admin/stock"
            className="p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Control de Stock</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gestionar inventario
            </p>
          </a>
        </div>
      </Card>

      {/* Nota sobre datos mock */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Los datos mostrados son de ejemplo. Se conectarán con datos reales cuando el backend esté disponible.
        </p>
      </Card>
    </div>
  );
}

