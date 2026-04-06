import { ApiError } from '@shared/api';

export interface UploadImageResponse {
  url: string;
  storageKey: string;
}

/**
 * Sube una imagen al servidor y devuelve la URL pública.
 *
 * Nota: NO usamos `apiClient` ni `adminFetch` aquí porque esos wrappers
 * siempre añaden `Content-Type: application/json` y serializan el body como JSON.
 * Para multipart/form-data el navegador debe poner el header con el
 * boundary correcto — por eso hacemos el fetch directamente.
 *
 * Usamos una URL relativa que apunta al BFF Route Handler (same-origin),
 * el cual reenvía el FormData al backend con la cookie HttpOnly de admin.
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
    // No ponemos Content-Type — el navegador lo setea solo con el boundary
  });

  if (!response.ok) {
    let message = response.statusText;

    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // body no es JSON — usar statusText
    }

    throw new ApiError(response.status, message);
  }

  // Unwrap NestJS envelope: { success, data, timestamp } → data
  const json = await response.json();
  return (json?.data !== undefined ? json.data : json) as UploadImageResponse;
}
