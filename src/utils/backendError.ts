import { isAxiosError } from 'axios';

/** Body de error del GlobalExceptionFilter de fieldpartner-back. */
interface BackendErrorBody {
  code?: string;
  message?: string;
  errors?: string[];
}

/**
 * Mensaje legible de un error del back: el `message` (y el detalle de validación si lo hay),
 * o `fallback` si el error no vino del back (red caída, timeout, etc.).
 */
export const backendErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError<BackendErrorBody>(error) || !error.response?.data?.message) return fallback;
  const { message, errors } = error.response.data;
  return errors?.length ? `${message}: ${errors.join(', ')}` : message;
};
