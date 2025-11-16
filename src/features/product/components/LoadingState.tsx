export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Cargando productos...</p>
    </div>
  );
}

