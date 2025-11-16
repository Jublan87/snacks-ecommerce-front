import Link from 'next/link';
import type { Product } from '@/features/product/types';

interface ProductBreadcrumbsProps {
  product: Product;
}

export default function ProductBreadcrumbs({
  product,
}: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        Inicio
      </Link>
      <span className="text-gray-400" aria-hidden="true">
        /
      </span>
      <Link
        href="/productos"
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        Productos
      </Link>
      {product.category && (
        <>
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <Link
            href={`/productos?categoria=${product.category.slug}`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {product.category.name}
          </Link>
        </>
      )}
      <span className="text-gray-400" aria-hidden="true">
        /
      </span>
      <span className="text-gray-900 font-medium truncate max-w-xs">
        {product.name}
      </span>
    </nav>
  );
}

