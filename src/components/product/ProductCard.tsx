'use client'; // Componente del cliente (necesita interactividad para el botón)

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddToCart } from '@/hooks/useAddToCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Usar el hook personalizado para manejar la lógica de agregar al carrito
  // quantity: 1 por defecto (desde la card siempre se agrega 1 unidad)
  const { handleAddToCart, isAdding, isOutOfStock } = useAddToCart({
    product,
    quantity: 1,
  });

  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  // Función que se ejecuta al hacer clic en "Agregar al Carrito"
  const onButtonClick = (e: React.MouseEvent) => {
    // Prevenir que el click se propague al Link del producto
    e.preventDefault();
    e.stopPropagation();
    // Llamar a la función del hook
    handleAddToCart();
  };

  return (
    <article
      className="group relative flex flex-col bg-white rounded-lg shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      aria-label={`Producto: ${product.name}`}
    >
      {/* Imagen */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gray-100 group-hover:shadow-lg transition-shadow duration-300"
      >
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge de oferta */}
        {hasDiscount && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 z-10"
            aria-label={`${product.discountPercentage}% de descuento`}
          >
            -{product.discountPercentage}%
          </Badge>
        )}

        {/* Overlay sin stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white text-black px-4 py-2 rounded-md font-semibold">
              Sin Stock
            </span>
          </div>
        )}
      </Link>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4">
        {/* Categoría */}
        {product.category && (
          <Link
            href={`/productos/categoria/${product.category.slug}`}
            className="text-xs text-gray-500 hover:text-gray-700 mb-1 transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        {/* Nombre */}
        <Link href={`/productos/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 mb-2 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Descripción corta */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Precio */}
        <div className="flex items-baseline gap-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-red-600">
                ${currentPrice.toLocaleString('es-AR')}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toLocaleString('es-AR')}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ${currentPrice.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {/* Stock */}
        {!isOutOfStock && (
          <p className="text-xs text-green-600 mb-3">
            ✓ {product.stock} unidades disponibles
          </p>
        )}

        {/* Botón agregar al carrito */}
        <Button
          className="mt-auto w-full bg-[#FF5454] hover:bg-[#E63939] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          variant={isOutOfStock ? 'secondary' : 'default'}
          disabled={isOutOfStock || isAdding}
          onClick={onButtonClick}
          aria-label={
            isOutOfStock
              ? 'Producto sin stock'
              : `Agregar ${product.name} al carrito`
          }
        >
          {isAdding ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Agregando...
            </>
          ) : isOutOfStock ? (
            'Sin Stock'
          ) : (
            'Agregar al Carrito'
          )}
        </Button>
      </div>
    </article>
  );
}
