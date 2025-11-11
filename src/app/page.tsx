export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          🎉 ¡Hola Mundo!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Tu proyecto Next.js 15 está funcionando correctamente
        </p>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Snacks Ecommerce
          </h2>
          <p className="text-lg">
            Distribuidor de snacks - Proyecto en desarrollo
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">✅ Next.js 15</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Framework configurado
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">🎨 Tailwind CSS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estilos configurados
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">📘 TypeScript</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tipado configurado
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

