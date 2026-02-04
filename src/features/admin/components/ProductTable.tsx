'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/features/product/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
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
import { Edit, Trash2, Search, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import AdminDataTable, {
  AdminDataTableEmptyRow,
  type AdminDataTableColumn,
} from '@/features/admin/components/AdminDataTable';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onCreate: () => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onCreate,
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  const productColumns: AdminDataTableColumn[] = [
    { id: 'product', label: 'Producto', sortable: true },
    { id: 'sku', label: 'SKU', sortable: true },
    { id: 'category', label: 'Categoría', sortable: true },
    { id: 'price', label: 'Precio', sortable: true },
    { id: 'stock', label: 'Stock', sortable: true },
    { id: 'status', label: 'Estado', sortable: true },
    { id: 'actions', label: 'Acciones', align: 'right' },
  ];

  // Obtener categorías únicas para el filtro
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) {
        cats.add(p.category.name);
      }
    });
    return Array.from(cats);
  }, [products]);

  // Filtrar y buscar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Búsqueda por nombre, SKU o descripción
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por estado
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.isActive) ||
        (statusFilter === 'inactive' && !product.isActive);

      // Filtro por categoría
      const matchesCategory =
        categoryFilter === 'all' || product.category?.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
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
          return dir * (a.category?.name ?? '').localeCompare(b.category?.name ?? '');
        case 'price':
          return dir * (a.price - b.price);
        case 'stock':
          return dir * (a.stock - b.stock);
        case 'status':
          return dir * (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  // Resetear página cuando cambian los filtros
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.images.find((img) => img.isPrimary);
    return primaryImage?.url || product.images[0]?.url || '/placeholder-product.png';
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre, SKU o descripción..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange();
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as 'all' | 'active' | 'inactive');
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onCreate} 
          className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Tabla de productos */}
      <AdminDataTable
        columns={productColumns}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyMessage="No se encontraron productos"
        emptyColSpan={7}
        footer={
          totalPages > 1 ? (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {paginatedProducts.length} de {sortedProducts.length} productos
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? 'bg-brand hover:bg-brand-hover text-white'
                              : ''
                          }
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {paginatedProducts.length === 0 ? (
          <AdminDataTableEmptyRow
            message="No se encontraron productos"
            colSpan={7}
          />
        ) : (
          paginatedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-[rgb(var(--brand)/0.03)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          {product.isFeatured && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              Destacado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {product.discountPrice ? (
                          <>
                            <div className="line-through text-gray-400">
                              {formatPrice(product.price)}
                            </div>
                            <div className="font-medium text-red-600">
                              {formatPrice(product.discountPrice)}
                            </div>
                          </>
                        ) : (
                          <div className="font-medium">{formatPrice(product.price)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge
                        className={
                          product.stock > 0
                            ? 'bg-green-500 text-white border-transparent hover:bg-green-600'
                            : 'bg-red-500 text-white border-transparent hover:bg-red-600'
                        }
                      >
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          product.isActive
                            ? 'bg-green-500 text-white border-transparent hover:bg-green-600'
                            : 'bg-red-500 text-white border-transparent hover:bg-red-600'
                        }
                      >
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/productos/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" title="Ver producto">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(product)}
                          title="Eliminar producto"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
          ))
        )}
      </AdminDataTable>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El producto "{productToDelete?.name}" será
              eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

