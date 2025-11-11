import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;
  const isOutOfStock = product.stock === 0;

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
          <div
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10"
            aria-label={`${product.discountPercentage}% de descuento`}
          >
            -{product.discountPercentage}%
          </div>
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

        {/* Botón agregar (por ahora solo visual) */}
        <button
          className={`mt-auto w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={isOutOfStock}
          aria-label={
            isOutOfStock
              ? 'Producto sin stock'
              : `Agregar ${product.name} al carrito`
          }
        >
          {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
        </button>
      </div>
    </article>
  );
}
