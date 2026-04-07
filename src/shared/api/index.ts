// Client-safe exports — safe to import in client components, stores, and client services.
// For server-only helpers (serverGet, serverPost, …) import directly from '@shared/api/server'.
export { apiClient } from './client';
export { adminFetch } from './admin-client';
export { clientFetch } from './client-bff';
export { ApiError } from './api-error';
