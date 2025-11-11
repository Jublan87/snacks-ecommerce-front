import ProductCard from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/mocks/products.mock';

export default function ProductosPage() {
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

      {/* Lista de productos */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
