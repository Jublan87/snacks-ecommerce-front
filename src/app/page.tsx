import ProductCard from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/mocks/products.mock';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🛒 Snacks Ecommerce
          </h1>
          <p className="text-xl md:text-2xl">
            Tu distribuidor de snacks favorito
          </p>
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Productos Destacados
        </h2>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

