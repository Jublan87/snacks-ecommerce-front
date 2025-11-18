/**
 * Utilidades para guardar y recuperar usuarios mock desde localStorage
 * Temporal hasta que tengamos backend
 */

import { User } from '@/features/auth/types';

export interface MockUserData {
  email: string;
  password: string;
  user: User;
}

const STORAGE_KEY = 'mock-users-storage';

/**
 * Guarda los usuarios mock en localStorage
 */
export function saveMockUsers(users: MockUserData[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuarios en localStorage:', error);
  }
}

/**
 * Recupera los usuarios mock desde localStorage
 */
export function getMockUsers(): MockUserData[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved) as MockUserData[];
  } catch (error) {
    console.error('Error al recuperar usuarios de localStorage:', error);
    return [];
  }
}

/**
 * Agrega un nuevo usuario a la lista y lo guarda
 */
export function addMockUser(user: MockUserData): void {
  const users = getMockUsers();
  users.push(user);
  saveMockUsers(users);
}

/**
 * Verifica si un email ya existe en los usuarios guardados
 */
export function emailExists(email: string): boolean {
  const users = getMockUsers();
  return users.some((u) => u.email === email);
}

/**
 * Busca un usuario por email y contraseña
 */
export function findMockUser(
  email: string,
  password: string
): MockUserData | undefined {
  const users = getMockUsers();
  return users.find((u) => u.email === email && u.password === password);
}
