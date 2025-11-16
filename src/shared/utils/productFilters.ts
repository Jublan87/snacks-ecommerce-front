import { Product } from '@/features/product/types';
import type { SortOption } from '@/features/filters/types';

export function filterProducts(
  products: Product[],
  searchQuery: string,
  selectedCategories: string[],
  hasDiscount?: boolean
): Product[] {
  let filtered = [...products];

  // Filtro por búsqueda
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filtro por categorías
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((product) =>
      selectedCategories.includes(product.categoryId)
    );
  }

  // Filtro por descuento
  if (hasDiscount === true) {
    filtered = filtered.filter((product) => !!product.discountPrice);
  }

  return filtered;
}

export function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));

    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });

    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });

    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    default:
      return sorted;
  }
}

export function paginateProducts<T>(
  products: T[],
  page: number,
  itemsPerPage: number
): { paginatedProducts: T[]; totalPages: number } {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return { paginatedProducts, totalPages };
}
