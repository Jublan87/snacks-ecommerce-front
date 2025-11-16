'use client';

interface DiscountFilterProps {
  hasDiscount: boolean;
  onDiscountChange: (hasDiscount: boolean) => void;
}

export default function DiscountFilter({
  hasDiscount,
  onDiscountChange,
}: DiscountFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Ofertas</h3>
      <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
        <input
          type="checkbox"
          checked={hasDiscount}
          onChange={(e) => onDiscountChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Con descuento</span>
      </label>
    </div>
  );
}

