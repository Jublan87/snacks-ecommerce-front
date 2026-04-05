'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@features/product/types';
import {
  categoryFormSchema,
  type CategoryFormInput,
} from '@features/admin/schemas/product.schema';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryManagerProps {
  categories: Category[];
  onCreate: (data: CategoryFormInput) => Promise<void> | void;
  onUpdate: (id: string, data: Partial<CategoryFormInput>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

/**
 * Componente para gestionar categorías (CRUD básico)
 */
export default function CategoryManager({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parentId: null,
      order: 0,
      isActive: true,
    },
  });

  // Obtener todas las categorías en formato plano
  const getAllCategoriesFlat = (cats: Category[]): Category[] => {
    const flat: Category[] = [];
    const flatten = (categoryList: Category[]) => {
      categoryList.forEach((cat) => {
        flat.push(cat);
        if (cat.children) {
          flatten(cat.children);
        }
      });
    };
    flatten(cats);
    return flat;
  };

  const flatCategories = getAllCategoriesFlat(categories);

  const handleCreate = () => {
    setEditingCategory(null);
    reset({
      name: '',
      slug: '',
      description: '',
      parentId: null,
      order: 0,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || null,
      order: category.order,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await onDelete(categoryToDelete.id);
        toast.success('Categoría eliminada correctamente');
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Error al eliminar la categoría',
        );
      }
    }
  };

  const onSubmit = async (data: CategoryFormInput) => {
    try {
      // Asegurar que order e isActive tengan valores por defecto
      const formData: CategoryFormInput = {
        ...data,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      };

      if (editingCategory) {
        await onUpdate(editingCategory.id, formData);
        toast.success('Categoría actualizada correctamente');
      } else {
        await onCreate(formData);
        toast.success('Categoría creada correctamente');
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al guardar la categoría',
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Categorías</h2>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-brand hover:bg-brand-hover text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flatCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                    title="Editar categoría"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(category)}
                    title="Eliminar categoría"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.description && (
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Badge
                    className={
                      category.isActive
                        ? 'bg-green-500 text-white border-transparent hover:bg-green-600'
                        : 'bg-red-500 text-white border-transparent hover:bg-red-600'
                    }
                  >
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                  {category.parentId && (
                    <Badge variant="outline">
                      {flatCategories.find((c) => c.id === category.parentId)
                        ?.name || 'Subcategoría'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de crear/editar categoría */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Modifica los datos de la categoría'
                : 'Completa los datos para crear una nueva categoría'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="cat-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre *
              </label>
              <Input
                id="cat-name"
                {...register('name')}
                placeholder="Ej: Snacks Salados"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cat-slug"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Slug *
              </label>
              <Input
                id="cat-slug"
                {...register('slug')}
                placeholder="snacks-salados"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cat-description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="cat-description"
                {...register('description')}
                rows={3}
                className="flex min-h-[44px] w-full rounded-md border border-input bg-white px-3 py-2 text-base text-gray-900 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Descripción de la categoría..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría Padre
              </label>
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(value) =>
                      field.onChange(value === 'none' ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin categoría padre</SelectItem>
                      {flatCategories
                        .filter((c) => c.id !== editingCategory?.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <label
                htmlFor="cat-order"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Orden
              </label>
              <Input
                id="cat-order"
                type="number"
                min="0"
                {...register('order', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.order.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cat-active"
                {...register('isActive')}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <label
                htmlFor="cat-active"
                className="text-sm font-medium text-gray-700"
              >
                Categoría Activa
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingCategory(null);
                  reset();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-brand hover:bg-brand-hover text-white"
              >
                {editingCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La categoría &quot;
              {categoryToDelete?.name}&quot; será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
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
