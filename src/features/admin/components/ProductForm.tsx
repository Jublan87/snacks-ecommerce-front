'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product, ProductImage, Category } from '@features/product/types';
import {
  productFormSchema,
  type ProductFormInput,
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
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Separator } from '@shared/ui/separator';
import ProductImageUpload from './ProductImageUpload';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormInput) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Formulario para crear o editar un producto
 */
export default function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription || '',
          sku: product.sku,
          price: product.price,
          discountPercentage: product.discountPercentage ?? undefined,
          stock: product.stock,
          categoryId: product.categoryId,
          images: product.images || [],
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          tags: product.tags || [],
          weight: product.weight ?? undefined,
          dimensions: product.dimensions ?? undefined,
        }
      : {
          name: '',
          slug: '',
          description: '',
          shortDescription: '',
          sku: '',
          price: 0,
          discountPercentage: undefined,
          stock: 0,
          categoryId: '',
          images: [],
          isActive: true,
          isFeatured: false,
          tags: [],
          weight: undefined,
          dimensions: undefined,
        },
  });

  // Generar slug automáticamente desde el nombre
  const productName = watch('name');
  useEffect(() => {
    if (!isEditing && productName) {
      const autoSlug = productName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', autoSlug);
    }
  }, [productName, isEditing, setValue]);

  // Calcular precio con descuento basado en el porcentaje
  const price = watch('price');
  const discountPercentage = watch('discountPercentage');
  const discountPrice =
    discountPercentage && price
      ? price * (1 - discountPercentage / 100)
      : undefined;

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

  const onFormSubmit = async (data: ProductFormInput) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al guardar el producto',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Producto *
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej: Doritos Nacho Cheese 150g"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug (URL) *
            </label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="doritos-nacho-cheese-150g"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              SKU *
            </label>
            <Input
              id="sku"
              {...register('sku', {
                  setValueAs: (v) => (typeof v === 'string' ? v.toUpperCase() : v),
                })}
              placeholder="DOR-NAC-150"
              className="uppercase"
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="flex min-h-[44px] w-full rounded-md border border-input bg-white px-3 py-2 text-base text-gray-900 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Descripción completa del producto..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción Corta
            </label>
            <Input
              id="shortDescription"
              {...register('shortDescription')}
              placeholder="Descripción breve para mostrar en listados..."
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoría *
            </label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {flatCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Precio y Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Precio y Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Precio *
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="discountPercentage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Porcentaje de Descuento (%)
              </label>
              <Input
                id="discountPercentage"
                type="number"
                step="1"
                min="0"
                max="100"
                {...register('discountPercentage', {
                  setValueAs: (v) => (v === '' || v === undefined ? undefined : Number(v)),
                })}
                placeholder="0"
              />
              {discountPercentage &&
                discountPercentage > 0 &&
                discountPrice && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Precio con descuento:{' '}
                      {new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                      }).format(discountPrice)}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      Ahorro:{' '}
                      {new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                      }).format(price - discountPrice)}
                    </p>
                  </div>
                )}
              {errors.discountPercentage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stock *
            </label>
            <Input
              id="stock"
              type="number"
              min="0"
              {...register('stock', { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stock.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Imágenes */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ProductImageUpload
                // `id` es opcional en el esquema Zod (imágenes nuevas aún no tienen id),
                // pero ProductImageUpload requiere ProductImage[] con id requerido.
                // Al renderizar, todas las imágenes ya tienen id asignado por el componente.
                images={field.value as ProductImage[]}
                onChange={field.onChange}
              />
            )}
          />
          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Peso (gramos)
            </label>
            <Input
              id="weight"
              type="number"
              min="0"
              {...register('weight', {
                valueAsNumber: true,
                setValueAs: (v) => (v === '' ? undefined : Number(v)),
              })}
              placeholder="150"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">
                {errors.weight.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensiones (cm)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ancho"
                  {...register('dimensions.width', {
                    setValueAs: (v) => (v === '' || v === undefined ? undefined : Number(v)),
                  })}
                />
                {errors.dimensions?.width && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dimensions.width.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Alto"
                  {...register('dimensions.height', {
                    setValueAs: (v) => (v === '' || v === undefined ? undefined : Number(v)),
                  })}
                />
                {errors.dimensions?.height && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dimensions.height.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Profundidad"
                  {...register('dimensions.depth', {
                    setValueAs: (v) => (v === '' || v === undefined ? undefined : Number(v)),
                  })}
                />
                {errors.dimensions?.depth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dimensions.depth.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm font-medium text-gray-700">
                Producto Activo
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm font-medium text-gray-700">
                Producto Destacado
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-brand hover:bg-brand-hover text-white"
        >
          {isLoading
            ? 'Guardando...'
            : isEditing
              ? 'Actualizar Producto'
              : 'Crear Producto'}
        </Button>
      </div>
    </form>
  );
}
