'use client';

import { useEffect, useState } from 'react';
import { Product } from '@features/product/types';
import { useProductStore } from '@features/admin/store/product-store';
import { getProductById } from '@features/admin/services/product.service';
import { type ProductFormInput, type CategoryFormInput } from '@features/admin/schemas/product.schema';
import ProductTable from '@features/admin/components/ProductTable';
import ProductForm from '@features/admin/components/ProductForm';
import CategoryManager from '@features/admin/components/CategoryManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import { Card, CardContent } from '@shared/ui/card';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { toast } from 'sonner';
import { Package, Tag } from 'lucide-react';

export default function AdminProductosPage() {
  const {
    products,
    categories,
    isLoading,
    fetchAll,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useProductStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  // Cargar datos desde la API al montar
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = async (product: Product) => {
    try {
      const fullProduct = await getProductById(product.id);
      setEditingProduct(fullProduct);
    } catch {
      // Si falla el fetch del detalle, usar el producto del listado como fallback
      setEditingProduct(product);
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el producto'
      );
    }
  };

  const handleSubmit = async (data: ProductFormInput) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success('Producto actualizado correctamente');
      } else {
        await createProduct(data);
        toast.success('Producto creado correctamente');
      }
      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar el producto'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleCategoryCreate = async (data: CategoryFormInput) => {
    // CategoryManager llama esto sincrónicamente — re-lanzar permite que el componente
    // capture el error y muestre el toast correspondiente.
    await createCategory(data);
  };

  const handleCategoryUpdate = async (
    id: string,
    data: Partial<CategoryFormInput>
  ) => {
    await updateCategory(id, data);
  };

  const handleCategoryDelete = async (id: string) => {
    await deleteCategory(id);
  };

  const tabs = [
    { id: 'products', name: 'Productos', icon: Package },
    { id: 'categories', name: 'Categorías', icon: Tag },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Productos
        </h1>
        <p className="text-gray-600 mt-1">
          Administra el catálogo de productos y categorías
        </p>
      </div>

      {/* Indicador de carga global */}
      {isLoading && products.length === 0 && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          Cargando datos...
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <TabGroup>
            <TabList className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Tab
                    key={tab.id}
                    className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm font-medium transition-colors whitespace-nowrap data-[selected]:border-b-2 data-[selected]:border-brand data-[selected]:text-brand data-[selected]:bg-brand/10 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </Tab>
                );
              })}
            </TabList>

            <TabPanels className="p-6">
              <TabPanel>
                <div className="space-y-6">
                  <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                  />
                </div>
              </TabPanel>

              <TabPanel>
                <CategoryManager
                  categories={categories}
                  onCreate={handleCategoryCreate}
                  onUpdate={handleCategoryUpdate}
                  onDelete={handleCategoryDelete}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </CardContent>
      </Card>

      {/* Dialog del formulario de producto */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            key={editingProduct?.id ?? 'new'}
            product={editingProduct}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
