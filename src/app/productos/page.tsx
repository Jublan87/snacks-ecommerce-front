'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import ProductCard from '@/features/product/components/ProductCard';
import CategoryFilter from '@/features/filters/components/CategoryFilter';
import DiscountFilter from '@/features/filters/components/DiscountFilter';
import ProductSort from '@/features/filters/components/ProductSort';
import type { SortOption } from '@/features/filters/types';
import ProductPagination from '@/features/filters/components/ProductPagination';
import EmptyState from '@/features/product/components/EmptyState';
import LoadingState from '@/features/product/components/LoadingState';
import { MOCK_PRODUCTS } from '@/features/product/mocks/products.mock';
import { useSearch } from '@/shared/contexts/SearchContext';
import {
  filterProducts,
  sortProducts,
  paginateProducts,
} from '@/shared/utils/productFilters';

const ITEMS_PER_PAGE = 12;

export default function ProductosPage() {
  const { searchQuery } = useSearch();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const productsContainerRef = useRef<HTMLDivElement>(null);

  // Manejar cambio de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Limpiar todos los filtros de categoría
  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  // Resetear página cuando cambian los filtros o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, hasDiscount, sortBy]);

  // Procesar productos: filtrar, ordenar y paginar
  const processedProducts = useMemo(() => {
    // Filtrar productos
    let filtered = filterProducts(
      MOCK_PRODUCTS.filter((p) => p.isActive),
      searchQuery,
      selectedCategories,
      hasDiscount
    );

    // Ordenar productos
    const sorted = sortProducts(filtered, sortBy);

    // Paginar productos
    const { paginatedProducts, totalPages } = paginateProducts(
      sorted,
      currentPage,
      ITEMS_PER_PAGE
    );

    return {
      products: paginatedProducts,
      totalPages,
      totalCount: sorted.length,
    };
  }, [searchQuery, selectedCategories, hasDiscount, sortBy, currentPage]);

  // Manejar transición suave al cambiar de página
  useEffect(() => {
    setIsPageTransitioning(true);

    // Scroll inmediato al inicio
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      });
    }

    // Pequeño delay para permitir que React actualice el DOM antes de mostrar los nuevos productos
    const transitionTimer = setTimeout(() => {
      setIsPageTransitioning(false);
      // Scroll suave después de que los productos se hayan renderizado
      setTimeout(() => {
        if (productsContainerRef.current) {
          productsContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 50);
    }, 150);

    return () => clearTimeout(transitionTimer);
  }, [currentPage]);

  // Simular loading state solo para cambios de filtros/búsqueda
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories, hasDiscount, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header de la página */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Todos los Productos
          </h1>
          <p className="text-gray-600 mt-2">
            Encuentra los mejores snacks para ti
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overlay para mobile cuando los filtros están abiertos */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters
                ? 'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-64 lg:w-auto'
                : 'hidden lg:block'
            }`}
            aria-label="Filtros de productos"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 h-full lg:h-auto overflow-y-auto lg:overflow-y-visible">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-lg text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar filtros"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Ordenamiento */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
              </div>

              {/* Categorías */}
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onClearCategories={handleClearCategories}
              />

              {/* Filtro de descuento */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <DiscountFilter
                  hasDiscount={hasDiscount}
                  onDiscountChange={setHasDiscount}
                />
              </div>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1" ref={productsContainerRef}>
            {/* Barra de filtros mobile y contador */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Botón para mostrar filtros en mobile */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  aria-label={`Abrir filtros${selectedCategories.length > 0 || hasDiscount ? `, ${selectedCategories.length + (hasDiscount ? 1 : 0)} filtro${selectedCategories.length + (hasDiscount ? 1 : 0) > 1 ? 's' : ''} activo${selectedCategories.length + (hasDiscount ? 1 : 0) > 1 ? 's' : ''}` : ''}`}
                  aria-expanded={showFilters}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filtros
                  {(selectedCategories.length > 0 || hasDiscount) && (
                    <span
                      className="ml-1 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full"
                      aria-label={`${selectedCategories.length + (hasDiscount ? 1 : 0)} filtro${selectedCategories.length + (hasDiscount ? 1 : 0) > 1 ? 's' : ''} activo${selectedCategories.length + (hasDiscount ? 1 : 0) > 1 ? 's' : ''}`}
                    >
                      {selectedCategories.length + (hasDiscount ? 1 : 0)}
                    </span>
                  )}
                </button>

                {/* Contador de resultados */}
                {!isLoading && (
                  <div className="text-sm text-gray-600" role="status" aria-live="polite">
                    {processedProducts.totalCount === 0 ? (
                      <span>No se encontraron productos</span>
                    ) : (
                      <span>
                        Mostrando {processedProducts.products.length} de{' '}
                        {processedProducts.totalCount} productos
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingState />}

            {/* Lista de productos o Empty State */}
            {!isLoading && processedProducts.products.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                key={`products-${currentPage}`}
                className={`transition-opacity duration-200 ${
                  isPageTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {processedProducts.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Paginación */}
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={processedProducts.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
