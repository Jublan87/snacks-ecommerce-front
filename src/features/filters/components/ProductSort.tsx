'use client';

import type { SortOption } from '@/features/filters/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export type { SortOption };

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Nombre (A-Z)' },
  { value: 'name-desc', label: 'Nombre (Z-A)' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'newest', label: 'Más Recientes' },
  { value: 'oldest', label: 'Más Antiguos' },
];

export default function ProductSort({
  sortBy,
  onSortChange,
}: ProductSortProps) {
  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || 'Más relevantes';

  return (
    <div className="space-y-2">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-gray-700 block"
      >
        Ordenar por
      </label>
      <Select
        value={sortBy}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <SelectTrigger
          id="sort-select"
          className="w-full border-0 border-b border-gray-300 rounded-none px-0 py-1 h-auto bg-transparent hover:border-gray-400 focus:ring-0 focus:border-gray-500 shadow-none [&>span]:text-sm [&>span]:text-gray-700"
        >
          <SelectValue placeholder={currentLabel} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
