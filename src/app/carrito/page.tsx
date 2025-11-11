export default function CarritoPage() {
  return (
    <div className="min-h-screen">
      {/* Header de la página */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Carrito de Compras
          </h1>
          <p className="text-gray-600 mt-2">
            Revisa tus productos antes de comprar
          </p>
        </div>
      </div>

      {/* Contenido del carrito */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            Agrega productos desde la página de productos
          </p>
          <a
            href="/productos"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Ver Productos
          </a>
        </div>
      </div>
    </div>
  );
}
