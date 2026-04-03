import { ApiError } from '@shared/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UploadImageResponse {
  url: string;
  storageKey: string;
}

/**
 * Sube una imagen al servidor y devuelve la URL pública.
 *
 * Nota: NO usamos `apiClient` aquí porque ese wrapper siempre añade
 * `Content-Type: application/json` y serializa el body como JSON.
 * Para multipart/form-data el navegador debe poner el header con el
 * boundary correcto — por eso hacemos el fetch directamente.
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/admin/upload`, {
    method: 'POST',
    credentials: 'include', // envía las cookies HttpOnly con el JWT
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
