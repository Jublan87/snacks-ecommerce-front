interface EmptyStateProps {
  message?: string;
  description?: string;
}

export default function EmptyState({
  message = 'No se encontraron productos',
  description = 'Intenta ajustar tus filtros o búsqueda para encontrar lo que buscas.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {description}
      </p>
    </div>
  );
}

