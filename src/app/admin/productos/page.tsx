'use client';

import { useEffect, useState } from 'react';
import { Product, Category } from '@/features/product/types';
import { useProductStore } from '@/features/admin/store/product-store';
import {
  productFormSchema,
  type ProductFormInput,
} from '@/features/admin/schemas/product.schema';
import {
  categoryFormSchema,
  type CategoryFormInput,
} from '@/features/admin/schemas/product.schema';
import ProductTable from '@/features/admin/components/ProductTable';
import ProductForm from '@/features/admin/components/ProductForm';
import CategoryManager from '@/features/admin/components/CategoryManager';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Card, CardContent } from '@/shared/ui/card';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { toast } from 'sonner';
import { Plus, Package, Tag } from 'lucide-react';

export default function AdminProductosPage() {
  const {
    products,
    categories,
    initializeWithMocks,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategoriesFlat,
  } = useProductStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar con datos mock si está vacío
  useEffect(() => {
    initializeWithMocks();
  }, [initializeWithMocks]);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (productId: string) => {
    try {
      deleteProduct(productId);
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el producto'
      );
    }
  };

  const handleSubmit = async (data: ProductFormInput) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        // Actualizar producto (el store calculará discountPrice automáticamente)
        updateProduct(editingProduct.id, data);
        toast.success('Producto actualizado correctamente');
      } else {
        // Crear producto (el store calculará discountPrice automáticamente)
        createProduct(data);
        toast.success('Producto creado correctamente');
      }
      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar el producto'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleCategoryCreate = (data: CategoryFormInput) => {
    try {
      createCategory(data);
    } catch (error) {
      throw error;
    }
  };

  const handleCategoryUpdate = (
    id: string,
    data: Partial<CategoryFormInput>
  ) => {
    try {
      updateCategory(id, data);
    } catch (error) {
      throw error;
    }
  };

  const handleCategoryDelete = (id: string) => {
    try {
      deleteCategory(id);
    } catch (error) {
      throw error;
    }
  };

  const tabs = [
    {
      id: 'products',
      name: 'Productos',
      icon: Package,
    },
    {
      id: 'categories',
      name: 'Categorías',
      icon: Tag,
    },
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

      {/* Dialog del formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
