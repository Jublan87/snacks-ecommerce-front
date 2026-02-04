'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/features/product/types';
import { useProductStore } from '@/features/admin/store/product-store';
import { useStockStore } from '@/features/admin/store/stock-store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Package,
  AlertTriangle,
  Archive,
  TrendingDown,
  History,
  Search,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminDataTable, {
  AdminDataTableEmptyRow,
  type AdminDataTableColumn,
} from '@/features/admin/components/AdminDataTable';

type StockFilter = 'all' | 'low' | 'out' | 'ok';

function getPrimaryImage(product: Product): string {
  const primary = product.images?.find((img) => img.isPrimary);
  return primary?.url || product.images?.[0]?.url || '/placeholder-product.png';
}

export default function StockInventory() {
  const {
    products,
    categories,
    initializeWithMocks,
    updateStock,
    getProductById,
    getAllCategoriesFlat,
  } = useProductStore();

  const {
    lowStockThreshold,
    addEntry,
    getHistoryByProduct,
  } = useStockStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditValue, setQuickEditValue] = useState('');
  const [historyProductId, setHistoryProductId] = useState<string | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<'set' | 'add'>('set');
  const [bulkValue, setBulkValue] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    initializeWithMocks();
  }, [initializeWithMocks]);

  const categoriesFlat = useMemo(() => getAllCategoriesFlat(), [categories, getAllCategoriesFlat]);
  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    categoriesFlat.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categoriesFlat]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      const low = lowStockThreshold;
      if (stockFilter === 'all') return true;
      if (stockFilter === 'low') return p.stock > 0 && p.stock <= low;
      if (stockFilter === 'out') return p.stock === 0;
      if (stockFilter === 'ok') return p.stock > low;
      return true;
    });
  }, [products, searchQuery, stockFilter, lowStockThreshold]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedProducts = useMemo(() => {
    if (!sortKey) return filteredProducts;
    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...filteredProducts].sort((a, b) => {
      switch (sortKey) {
        case 'product':
          return dir * a.name.localeCompare(b.name);
        case 'sku':
          return dir * a.sku.localeCompare(b.sku);
        case 'category':
          return dir * (categoryNames.get(a.categoryId) ?? '').localeCompare(categoryNames.get(b.categoryId) ?? '');
        case 'stock':
          return dir * (a.stock - b.stock);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortKey, sortDirection, categoryNames]);

  const stockColumns: AdminDataTableColumn[] = [
    { id: 'product', label: 'Producto', sortable: true },
    { id: 'sku', label: 'SKU', sortable: true },
    { id: 'category', label: 'Categoría', sortable: true },
    { id: 'stock', label: 'Stock', sortable: true },
    { id: 'actions', label: 'Acciones', align: 'right' },
  ];

  const metrics = useMemo(() => {
    const low = lowStockThreshold;
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= low).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
    return { totalProducts, lowStockCount, outOfStockCount, totalUnits };
  }, [products, lowStockThreshold]);

  const hasAlerts = metrics.lowStockCount > 0 || metrics.outOfStockCount > 0;

  const handleQuickSave = (productId: string) => {
    const product = getProductById(productId);
    if (!product) return;
    const value = parseInt(quickEditValue, 10);
    if (Number.isNaN(value) || value < 0) {
      toast.error('Ingresa un número válido (≥ 0)');
      return;
    }
    try {
      const { previousStock } = updateStock(productId, value);
      addEntry({
        productId,
        productName: product.name,
        previousStock,
        newStock: value,
        reason: 'Ajuste manual',
      });
      toast.success('Stock actualizado');
      setQuickEditId(null);
      setQuickEditValue('');
    } catch {
      toast.error('Error al actualizar stock');
    }
  };

  const handleBulkApply = () => {
    const value = parseInt(bulkValue, 10);
    if (Number.isNaN(value) || selectedIds.size === 0) {
      toast.error('Selecciona productos e ingresa un valor válido');
      return;
    }
    let updated = 0;
    selectedIds.forEach((id) => {
      const product = getProductById(id);
      if (!product) return;
      try {
        const { previousStock } = updateStock(
          id,
          bulkMode === 'set' ? value : product.stock + value
        );
        const newStock = bulkMode === 'set' ? value : Math.max(0, product.stock + value);
        addEntry({
          productId: id,
          productName: product.name,
          previousStock,
          newStock,
          reason: bulkMode === 'set' ? 'Ajuste masivo (valor fijo)' : 'Ajuste masivo (delta)',
        });
        updated++;
      } catch {
        // skip
      }
    });
    toast.success(`${updated} producto(s) actualizado(s)`);
    setBulkDialogOpen(false);
    setBulkValue('');
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const leadingHeader = (
    <input
      type="checkbox"
      checked={
        filteredProducts.length > 0 &&
        selectedIds.size === filteredProducts.length
      }
      onChange={toggleSelectAll}
      className="rounded border-gray-300"
    />
  );

  const historyForProduct = historyProductId
    ? getHistoryByProduct(historyProductId)
    : [];
  const historyProduct = historyProductId ? getProductById(historyProductId) : null;

  return (
    <div className="space-y-6">
      {/* Alertas de stock */}
      {hasAlerts && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">
              Alertas de inventario
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {metrics.outOfStockCount > 0 && (
                <span>
                  {metrics.outOfStockCount} producto(s) sin stock.
                </span>
              )}
              {metrics.outOfStockCount > 0 && metrics.lowStockCount > 0 && ' '}
              {metrics.lowStockCount > 0 && (
                <span>
                  {metrics.lowStockCount} producto(s) con stock bajo (≤{lowStockThreshold}).
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Package className="h-4 w-4" />
              Productos
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <TrendingDown className="h-4 w-4" />
              Stock bajo
            </div>
            <p className="text-2xl font-bold text-amber-700 mt-1">{metrics.lowStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <Archive className="h-4 w-4" />
              Sin stock
            </div>
            <p className="text-2xl font-bold text-red-700 mt-1">{metrics.outOfStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Package className="h-4 w-4" />
              Unidades totales
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalUnits}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockFilter)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el stock</SelectItem>
            <SelectItem value="low">Stock bajo</SelectItem>
            <SelectItem value="out">Sin stock</SelectItem>
            <SelectItem value="ok">Stock OK</SelectItem>
          </SelectContent>
        </Select>
        {selectedIds.size > 0 && (
          <Button
            onClick={() => setBulkDialogOpen(true)}
            className="bg-brand hover:bg-brand-hover text-white"
          >
            Ajustar {selectedIds.size} seleccionados
          </Button>
        )}
      </div>

      {/* Tabla de inventario */}
      <AdminDataTable
        columns={stockColumns}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        leadingHeader={leadingHeader}
        emptyMessage="No hay productos que coincidan con los filtros"
        emptyColSpan={6}
      >
        {sortedProducts.length === 0 ? (
          <AdminDataTableEmptyRow
            message="No hay productos que coincidan con los filtros"
            colSpan={6}
          />
        ) : (
          sortedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-[rgb(var(--brand)/0.03)]">
              <td className="w-10 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={() => toggleSelect(product.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                          {product.name}
                        </span>
                      </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {categoryNames.get(product.categoryId) ?? 'Sin categoría'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                      {quickEditId === product.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            value={quickEditValue}
                            onChange={(e) => setQuickEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleQuickSave(product.id);
                              if (e.key === 'Escape') {
                                setQuickEditId(null);
                                setQuickEditValue('');
                              }
                            }}
                            className="w-20 h-8 text-sm"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600"
                            onClick={() => handleQuickSave(product.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setQuickEditId(null);
                              setQuickEditValue('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              product.stock === 0
                                ? 'bg-red-500 text-white'
                                : product.stock <= lowStockThreshold
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-green-500 text-white'
                            }
                          >
                            {product.stock}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Editar stock"
                            onClick={() => {
                              setQuickEditId(product.id);
                              setQuickEditValue(String(product.stock));
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  title="Ver historial"
                  onClick={() => setHistoryProductId(product.id)}
                >
                  <History className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))
        )}
      </AdminDataTable>

      {/* Dialog bulk update */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuste masivo de stock</DialogTitle>
            <DialogDescription>
              {selectedIds.size} producto(s) seleccionado(s). Elige cómo actualizar el stock.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="bulkMode"
                  checked={bulkMode === 'set'}
                  onChange={() => setBulkMode('set')}
                />
                Establecer valor (reemplazar)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="bulkMode"
                  checked={bulkMode === 'add'}
                  onChange={() => setBulkMode('add')}
                />
                Sumar / restar (delta)
              </label>
            </div>
            <Input
              type="number"
              placeholder={bulkMode === 'set' ? 'Nuevo stock' : 'Cantidad a sumar (ej: -5)'}
              value={bulkValue}
              onChange={(e) => setBulkValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-brand hover:bg-brand-hover text-white"
              onClick={handleBulkApply}
            >
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog historial */}
      <Dialog open={!!historyProductId} onOpenChange={(open) => !open && setHistoryProductId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Historial de stock</DialogTitle>
            <DialogDescription>
              {historyProduct?.name} ({historyProduct?.sku})
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {historyForProduct.length === 0 ? (
              <p className="text-sm text-gray-500">Sin movimientos registrados</p>
            ) : (
              historyForProduct.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-600">
                    {entry.previousStock} → {entry.newStock}
                    {entry.reason && (
                      <span className="text-gray-400 ml-1">({entry.reason})</span>
                    )}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(entry.createdAt).toLocaleString('es-AR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
