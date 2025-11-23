'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/features/product/types';
import { cn } from '@/shared/utils/utils';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Ordenar imágenes: primaria primero, luego por orden
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  const selectedImage = sortedImages[selectedImageIndex] || sortedImages[0];

  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {selectedImage && (
          <Image
            src={selectedImage.url}
            alt={
              selectedImage.alt ||
              `${productName} - Imagen ${selectedImageIndex + 1}`
            }
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Miniaturas */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all',
                index === selectedImageIndex
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              aria-label={`Ver ${image.alt || `imagen ${index + 1} de ${productName}`}`}
              aria-pressed={index === selectedImageIndex}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
