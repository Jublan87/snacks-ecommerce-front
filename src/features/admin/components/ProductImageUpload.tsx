'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ProductImage } from '@features/product/types';
import { Button } from '@shared/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

/**
 * Componente para subir y gestionar imágenes de productos (mock)
 * En producción, esto se conectaría con un servicio de almacenamiento real
 */
export default function ProductImageUpload({
  images,
  onChange,
}: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simular upload de imagen (mock)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // En producción, aquí subirías el archivo a un servicio de almacenamiento
      // Por ahora, creamos una URL mock usando placehold.co
      const mockUrl = `https://placehold.co/600x600/FF6B35/FFFFFF/png?text=${encodeURIComponent(
        file.name
      )}`;

      const newImage: ProductImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: mockUrl,
        alt: file.name,
        isPrimary: images.length === 0, // La primera imagen es primaria por defecto
        order: images.length,
      };

      onChange([...images, newImage]);
    });

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const newImages = images.filter((img) => img.id !== imageId);
    // Si eliminamos la imagen primaria y hay otras imágenes, hacer la primera primaria
    const removedWasPrimary = images.find((img) => img.id === imageId)?.isPrimary;
    if (removedWasPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages);
  };

  const handleSetPrimary = (imageId: string) => {
    onChange(
      images.map((img) => ({
        ...img,
        isPrimary: img.id === imageId,
      }))
    );
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    // Actualizar orden
    newImages.forEach((img, index) => {
      img.order = index;
    });
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes del Producto
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Agrega imágenes del producto. La primera imagen será la principal.
        </p>

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Botón para seleccionar archivos */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar Imágenes
        </Button>
      </div>

      {/* Grid de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {image.isPrimary && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-brand text-white text-xs font-medium px-2 py-1 rounded">
                      Principal
                    </span>
                  </div>
                )}
              </div>

              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSetPrimary(image.id)}
                  disabled={image.isPrimary}
                  className="text-white hover:bg-white/20"
                  title="Marcar como principal"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveImage(image.id)}
                  className="text-white hover:bg-red-600/80"
                  title="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Botones de reordenar */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReorder(index, index - 1)}
                      className="h-6 w-6 bg-white/90 hover:bg-white text-gray-700"
                      title="Mover hacia arriba"
                    >
                      ↑
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReorder(index, index + 1)}
                      className="h-6 w-6 bg-white/90 hover:bg-white text-gray-700"
                      title="Mover hacia abajo"
                    >
                      ↓
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

