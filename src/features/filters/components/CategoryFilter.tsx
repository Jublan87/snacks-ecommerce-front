'use client';

import { Category } from '@features/product/types';
import { Button } from '@shared/ui/button';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  onClearCategories: () => void;
}

function flattenCategories(categories: Category[]): Category[] {
  const flat: Category[] = [];
  for (const category of categories) {
    flat.push(category);
    if (category.children?.length) {
      flat.push(...category.children);
    }
  }
  return flat.filter((cat) => cat.isActive);
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryChange,
  onClearCategories,
}: CategoryFilterProps) {
  const flatCategories = flattenCategories(categories);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Categorías</h3>
      <div className="space-y-2">
        {flatCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <Button
          variant="ghost"
          onClick={onClearCategories}
          className="text-sm mt-4"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
