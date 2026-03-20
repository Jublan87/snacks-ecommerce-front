'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, ApiError } from '@shared/api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  ActionResult,
} from '@features/auth/types/auth.types';

const BASE_URL = process.env.API_URL;

async function fetchWithCookieForward(
  path: string,
  body: unknown,
  method: 'POST' | 'PUT' = 'POST',
): Promise<ActionResult<User>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    cache: 'no-store',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // non-JSON body
    }
    return { success: false, error: message };
  }

  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    const parts = setCookie.split(';').map((p) => p.trim());
    const [nameValue, ...attrs] = parts;
    const eqIdx = nameValue.indexOf('=');
    const name = nameValue.slice(0, eqIdx);
    const value = nameValue.slice(eqIdx + 1);

    const options: Parameters<typeof cookieStore.set>[2] = {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    };

    for (const attr of attrs) {
      const lower = attr.toLowerCase();
      if (lower === 'secure') options.secure = true;
      if (lower.startsWith('max-age=')) options.maxAge = parseInt(attr.split('=')[1]);
      if (lower.startsWith('expires=')) options.expires = new Date(attr.split('=')[1]);
      if (lower.startsWith('samesite=')) {
        const sv = attr.split('=')[1].toLowerCase();
        options.sameSite = sv === 'strict' ? 'strict' : sv === 'none' ? 'none' : 'lax';
      }
    }

    cookieStore.set(name, value, options);
  }

  const data = await response.json() as User;
  return { success: true, data };
}

export async function loginAction(credentials: LoginCredentials): Promise<ActionResult<User>> {
  try {
    const result = await fetchWithCookieForward('/auth/login', credentials);
    if (result.success) {
      revalidatePath('/');
    }
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al iniciar sesión',
    };
  }
}

export async function registerAction(data: RegisterData): Promise<ActionResult<User>> {
  try {
    const result = await fetchWithCookieForward('/auth/register', data);
    if (result.success) {
      revalidatePath('/');
    }
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrarse',
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await serverPost('/auth/logout');
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    revalidatePath('/');
    return { success: true };
  }
}

export async function getMeAction(): Promise<ActionResult<User>> {
  try {
    const data = await serverGet<User>('/auth/me');
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { success: false, error: 'No autenticado' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener usuario',
    };
  }
}

export async function verifyAction(): Promise<ActionResult<{ valid: boolean }>> {
  try {
    const data = await serverGet<{ valid: boolean }>('/auth/verify');
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { success: false, error: 'Token inválido' };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al verificar token',
    };
  }
}

export async function updateProfileAction(data: UpdateProfileData): Promise<ActionResult<User>> {
  try {
    const updated = await serverPut<User>('/auth/profile', data);
    revalidatePath('/perfil');
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar perfil',
    };
  }
}

export async function changePasswordAction(data: ChangePasswordData): Promise<ActionResult> {
  try {
    await serverPut('/auth/password', data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar contraseña',
    };
  }
}
