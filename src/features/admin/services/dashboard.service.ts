import { apiClient } from '@shared/api';

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Estadísticas generales del dashboard — GET /api/admin/dashboard/stats */
export interface DashboardStats {
  totalProducts: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  totalCustomers: number;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

/**
 * Trae las métricas generales del negocio.
 * GET /api/admin/dashboard/stats
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>('/admin/dashboard/stats');
}
