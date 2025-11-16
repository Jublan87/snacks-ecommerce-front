'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, X } from 'lucide-react';

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductSearch({
  searchQuery,
  onSearchChange,
}: ProductSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const onSearchChangeRef = useRef(onSearchChange);

  // Mantener la referencia actualizada
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // Sincronizar con searchQuery externo
  useEffect(() => {
    if (searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Debounce para evitar búsquedas excesivas
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChangeRef.current(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="pl-10 pr-10"
      />
      {localQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setLocalQuery('');
            onSearchChange('');
          }}
          className="absolute inset-y-0 right-0 h-full"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
