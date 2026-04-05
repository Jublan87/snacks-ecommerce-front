'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@shared/ui/card';
import { Package, ShoppingCart, DollarSign, Users, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getDashboardStats, type DashboardStats } from '@features/admin/services/dashboard.service';

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface MetricCard {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formatea un número monetario como $ con separador de miles */
function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`;
}

/** Construye las tarjetas de métricas a partir de los stats reales */
function buildMetrics(stats: DashboardStats): MetricCard[] {
  return [
    {
      title: 'Total de Productos',
      value: stats.totalProducts.toLocaleString('es-AR'),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Pedidos del Mes',
      value: stats.monthlyOrders.toLocaleString('es-AR'),
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total de Clientes',
      value: stats.totalCustomers.toLocaleString('es-AR'),
      icon: Users,
      color: 'bg-purple-500',
    },
  ];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Dashboard principal del panel de administración.
 * Muestra las 4 métricas clave del negocio obtenidas desde el backend.
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      setHasError(true);
      toast.error('No se pudieron cargar las estadísticas', {
        description: error instanceof Error ? error.message : 'Error al conectar con el servidor',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ── Estado de carga ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del negocio</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <span className="ml-3 text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  // ── Estado de error ────────────────────────────────────────────────────────
  if (hasError || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del negocio</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['Total de Productos', 'Pedidos del Mes', 'Ingresos del Mes', 'Total de Clientes'] as const).map((title) => (
            <Card key={title} className="p-6">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-400 mt-2">--</p>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ── Vista principal ────────────────────────────────────────────────────────
  const metrics = buildMetrics(stats);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general del negocio</p>
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
                </div>
                <div className={`${metric.color} p-3 rounded-lg text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/productos"
            className="p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Gestionar Productos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Agregar, editar o eliminar productos
            </p>
          </Link>
          <Link
            href="/admin/pedidos"
            className="p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Ver Pedidos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Revisar y gestionar pedidos
            </p>
          </Link>
          <Link
            href="/admin/stock"
            className="p-4 border border-gray-200 rounded-lg hover:border-brand hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Control de Stock</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gestionar inventario
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
