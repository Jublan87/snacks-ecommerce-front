'use client';

import StockInventory from '@/features/admin/components/StockInventory';

export default function AdminStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Control de Stock</h1>
        <p className="text-gray-600 mt-1">
          Administra el inventario, alertas de stock bajo y ajustes masivos
        </p>
      </div>
      <StockInventory />
    </div>
  );
}
