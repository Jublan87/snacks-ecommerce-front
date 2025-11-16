'use client';

import { Category } from '@/features/product/types';
import { MOCK_CATEGORIES } from '@/features/product/mocks/products.mock';
import { Button } from '@/shared/ui/button';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  onClearCategories: () => void;
}

export default function CategoryFilter({
  selectedCategories,
  onCategoryChange,
  onClearCategories,
}: CategoryFilterProps) {
  // Función para obtener todas las categorías (incluyendo subcategorías)
  const getAllCategories = (): Category[] => {
    const allCategories: Category[] = [];

    MOCK_CATEGORIES.forEach((category) => {
      // Agregar categoría principal
      allCategories.push(category);

      // Agregar subcategorías si existen
      if (category.children) {
        allCategories.push(...category.children);
      }
    });

    return allCategories.filter((cat) => cat.isActive);
  };

  const categories = getAllCategories();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Categorías</h3>
      <div className="space-y-2">
        {categories.map((category) => {
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
