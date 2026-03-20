import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Category, ProductImage } from '@features/product/types';
import { ProductFormInput, CategoryFormInput } from '@features/admin/schemas/product.schema';

/** Asegura que cada imagen tenga id requerido para Product. */
function normalizeImages(
  images: ProductFormInput['images'],
  prefix = 'img'
): ProductImage[] {
  return (images || []).map((img, i) => ({
    ...img,
    id: img.id ?? `${prefix}-${Date.now()}-${i}`,
  }));
}

interface ProductStore {
  products: Product[];
  categories: Category[];
  
  // Productos
  createProduct: (product: ProductFormInput) => Product;
  updateProduct: (id: string, updates: Partial<ProductFormInput>) => Product;
  updateStock: (id: string, newStock: number) => { previousStock: number };
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  
  // Categorías
  createCategory: (category: CategoryFormInput) => Category;
  updateCategory: (id: string, updates: Partial<CategoryFormInput>) => Category;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getAllCategoriesFlat: () => Category[];
  
  // Utilidades
  initializeWithMocks: () => void;
}

// Función para generar ID único
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Función para generar slug desde nombre
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],

      // No-op: mock initialization removed. Admin data comes from API (Phase 5).
      initializeWithMocks: () => {},

      // Crear producto
      createProduct: (productData) => {
        let discountPrice: number | null = null;
        let discountPercentage: number | null = null;

        if (productData.discountPercentage !== undefined && productData.discountPercentage > 0) {
          discountPercentage = productData.discountPercentage;
          discountPrice = productData.price * (1 - discountPercentage / 100);
        }

        const newProduct: Product = {
          id: generateId('prod'),
          name: productData.name,
          slug: productData.slug || generateSlug(productData.name),
          description: productData.description,
          shortDescription: productData.shortDescription ?? null,
          sku: productData.sku,
          price: productData.price,
          discountPrice,
          discountPercentage,
          stock: productData.stock,
          categoryId: productData.categoryId,
          category: { id: productData.categoryId, name: '', slug: '' },
          specifications: null,
          isActive: productData.isActive ?? true,
          isFeatured: productData.isFeatured ?? false,
          tags: productData.tags || [],
          weight: productData.weight ?? null,
          dimensions: productData.dimensions ?? null,
          images: normalizeImages(productData.images || []),
          variants: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));

        return newProduct;
      },

      // Actualizar producto
      updateProduct: (id, updates) => {
        const currentProducts = get().products;
        const product = currentProducts.find((p) => p.id === id);

        if (!product) {
          throw new Error('Producto no encontrado');
        }

        const finalPrice = updates.price ?? product.price;
        let discountPrice: number | null;
        let discountPercentage: number | null;

        if (updates.discountPercentage !== undefined) {
          if (updates.discountPercentage > 0) {
            discountPercentage = updates.discountPercentage;
            discountPrice = finalPrice * (1 - discountPercentage / 100);
          } else {
            discountPrice = null;
            discountPercentage = null;
          }
        } else {
          discountPrice = product.discountPrice;
          discountPercentage = product.discountPercentage;
        }

        const updatedProduct: Product = {
          ...product,
          id,
          name: updates.name ?? product.name,
          slug: (updates.slug || updates.name) ? generateSlug(updates.name ?? product.name) : product.slug,
          description: updates.description ?? product.description,
          shortDescription: updates.shortDescription !== undefined ? (updates.shortDescription ?? null) : product.shortDescription,
          sku: updates.sku ?? product.sku,
          price: updates.price ?? product.price,
          discountPrice,
          discountPercentage,
          stock: updates.stock ?? product.stock,
          categoryId: updates.categoryId ?? product.categoryId,
          isActive: updates.isActive ?? product.isActive,
          isFeatured: updates.isFeatured ?? product.isFeatured,
          tags: updates.tags ?? product.tags,
          weight: updates.weight !== undefined ? (updates.weight ?? null) : product.weight,
          dimensions: updates.dimensions !== undefined ? (updates.dimensions ?? null) : product.dimensions,
          images: updates.images ? normalizeImages(updates.images) : product.images,
          updatedAt: new Date().toISOString(),
        };

        set({
          products: currentProducts.map((p) => (p.id === id ? updatedProduct : p)),
        });

        return updatedProduct;
      },

      // Actualizar solo stock (para gestión de inventario)
      updateStock: (id, newStock) => {
        const currentProducts = get().products;
        const product = currentProducts.find((p) => p.id === id);
        if (!product) {
          throw new Error('Producto no encontrado');
        }
        const previousStock = product.stock;
        const safeStock = Math.max(0, Math.floor(Number(newStock)));
        set({
          products: currentProducts.map((p) =>
            p.id === id
              ? { ...p, stock: safeStock, updatedAt: new Date().toISOString() }
              : p
          ),
        });
        return { previousStock };
      },

      // Eliminar producto
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Obtener producto por ID
      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      // Crear categoría
      createCategory: (categoryData) => {
        const now = new Date().toISOString();
        const newCategory: Category = {
          id: generateId('cat'),
          name: categoryData.name,
          slug: categoryData.slug || generateSlug(categoryData.name),
          description: categoryData.description ?? null,
          parentId: categoryData.parentId ?? null,
          image: null,
          order: categoryData.order ?? 0,
          isActive: categoryData.isActive ?? true,
          createdAt: now,
          updatedAt: now,
          children: [],
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));

        return newCategory;
      },

      // Actualizar categoría
      updateCategory: (id, updates) => {
        const currentCategories = get().categories;
        const category = currentCategories.find((c) => c.id === id);

        if (!category) {
          throw new Error('Categoría no encontrada');
        }

        const updatedCategory: Category = {
          ...category,
          name: updates.name ?? category.name,
          slug: (updates.slug || updates.name) ? generateSlug(updates.name ?? category.name) : category.slug,
          description: updates.description !== undefined ? (updates.description ?? null) : category.description,
          parentId: updates.parentId !== undefined ? (updates.parentId ?? null) : category.parentId,
          order: updates.order ?? category.order,
          isActive: updates.isActive ?? category.isActive,
          updatedAt: new Date().toISOString(),
          id,
        };

        set({
          categories: currentCategories.map((c) => (c.id === id ? updatedCategory : c)),
        });

        return updatedCategory;
      },

      // Eliminar categoría
      deleteCategory: (id) => {
        // Verificar que no haya productos usando esta categoría
        const productsUsingCategory = get().products.some((p) => p.categoryId === id);
        if (productsUsingCategory) {
          throw new Error('No se puede eliminar la categoría porque hay productos asociados');
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      // Obtener categoría por ID
      getCategoryById: (id) => {
        return get().categories.find((c) => c.id === id);
      },

      // Obtener todas las categorías en formato plano (incluyendo hijos)
      getAllCategoriesFlat: () => {
        const categories = get().categories;
        const flat: Category[] = [];

        const flatten = (cats: Category[]) => {
          cats.forEach((cat) => {
            flat.push(cat);
            if (cat.children) {
              flatten(cat.children);
            }
          });
        };

        flatten(categories);
        return flat;
      },
    }),
    {
      name: 'admin-product-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
      }),
    }
  )
);

