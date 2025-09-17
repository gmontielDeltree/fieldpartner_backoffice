/**
 * Servicio de Autenticación - Backend Español
 * Maneja toda la comunicación con los endpoints de usuarios del backend NestJS
 */

import { AxiosResponse } from 'axios';
import { backofficeApi } from '../config';
import {
  UsuarioLoginDto,
  UsuarioRegistroDto,
  ConfirmarEmailDto,
  RespuestaLoginDto,
  RespuestaRefreshTokenDto,
  CanalAutenticacion,
  ENDPOINTS_AUTH,
  CLAVES_LOCALSTORAGE,
  ErrorRespuestaAuth
} from '../types/auth.types';

/**
 * Servicio principal de autenticación
 */
export class AuthService {

  /**
   * Realiza login de usuario en el sistema
   * @param credentials - Email y contraseña del usuario
   * @param canal - Canal de autenticación (por defecto Backoffice)
   * @returns Respuesta del login con datos del usuario y tokens
   */
  async login(
    credentials: UsuarioLoginDto,
    canal: CanalAutenticacion = CanalAutenticacion.BACKOFFICE
  ): Promise<RespuestaLoginDto> {
    try {
      const response: AxiosResponse<RespuestaLoginDto> = await backofficeApi.post(
        ENDPOINTS_AUTH.LOGIN,
        credentials,
        {
          headers: {
            'channel': canal,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: ErrorRespuestaAuth = error.response.data;
        throw new Error(errorData.message || 'Error en el login');
      }
      throw new Error('Error de conexión al servidor');
    }
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param datosRegistro - Datos para registro del usuario
   * @returns Confirmación del registro
   */
  async registrar(datosRegistro: UsuarioRegistroDto): Promise<void> {
    try {
      await backofficeApi.post(ENDPOINTS_AUTH.REGISTRAR, datosRegistro);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: ErrorRespuestaAuth = error.response.data;
        throw new Error(errorData.message || 'Error en el registro');
      }
      throw new Error('Error de conexión al servidor');
    }
  }

  /**
   * Confirma el email del usuario con código de verificación
   * @param datosConfirmacion - Email y código de confirmación
   */
  async confirmarEmail(datosConfirmacion: ConfirmarEmailDto): Promise<void> {
    try {
      await backofficeApi.post(ENDPOINTS_AUTH.CONFIRMAR_EMAIL, datosConfirmacion);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: ErrorRespuestaAuth = error.response.data;
        throw new Error(errorData.message || 'Código de confirmación inválido');
      }
      throw new Error('Error de conexión al servidor');
    }
  }

  /**
   * Renueva el token de acceso usando refresh token
   * NOTA: Este endpoint aún no está implementado en el backend
   * @param refreshToken - Token de renovación
   * @returns Nuevo token de acceso
   */
  async renovarToken(refreshToken: string): Promise<RespuestaRefreshTokenDto> {
    try {
      const response: AxiosResponse<RespuestaRefreshTokenDto> = await backofficeApi.post(
        ENDPOINTS_AUTH.REFRESH_TOKEN,
        { refreshToken }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: ErrorRespuestaAuth = error.response.data;
        throw new Error(errorData.message || 'Error renovando token');
      }
      throw new Error('Error de conexión al servidor');
    }
  }

  /**
   * Almacena los datos de autenticación en localStorage
   * @param respuestaLogin - Respuesta del login con usuario y tokens
   */
  almacenarSesion(respuestaLogin: RespuestaLoginDto): void {
    const { usuario, autenticacion } = respuestaLogin;

    localStorage.setItem(CLAVES_LOCALSTORAGE.TOKEN_ACCESO, autenticacion.accessToken);
    localStorage.setItem(CLAVES_LOCALSTORAGE.TOKEN_REFRESH, autenticacion.refreshToken);
    localStorage.setItem(CLAVES_LOCALSTORAGE.EXPIRACION_TOKEN, autenticacion.expiration.toString());
    localStorage.setItem(CLAVES_LOCALSTORAGE.SESION_USUARIO, JSON.stringify(usuario));
  }

  /**
   * Recupera los datos de sesión desde localStorage
   * @returns Datos de sesión o null si no existen
   */
  recuperarSesion(): {
    tokenAcceso: string | null;
    tokenRefresh: string | null;
    expiracionToken: string | null;
    usuario: string | null;
  } {
    return {
      tokenAcceso: localStorage.getItem(CLAVES_LOCALSTORAGE.TOKEN_ACCESO),
      tokenRefresh: localStorage.getItem(CLAVES_LOCALSTORAGE.TOKEN_REFRESH),
      expiracionToken: localStorage.getItem(CLAVES_LOCALSTORAGE.EXPIRACION_TOKEN),
      usuario: localStorage.getItem(CLAVES_LOCALSTORAGE.SESION_USUARIO)
    };
  }

  /**
   * Verifica si el token actual ha expirado
   * @returns true si el token ha expirado
   */
  tokenHaExpirado(): boolean {
    const expiracion = localStorage.getItem(CLAVES_LOCALSTORAGE.EXPIRACION_TOKEN);
    if (!expiracion) return true;

    return new Date().getTime() > Number(expiracion);
  }

  /**
   * Limpia todos los datos de sesión del localStorage
   */
  limpiarSesion(): void {
    localStorage.removeItem(CLAVES_LOCALSTORAGE.TOKEN_ACCESO);
    localStorage.removeItem(CLAVES_LOCALSTORAGE.TOKEN_REFRESH);
    localStorage.removeItem(CLAVES_LOCALSTORAGE.EXPIRACION_TOKEN);
    localStorage.removeItem(CLAVES_LOCALSTORAGE.SESION_USUARIO);
    localStorage.removeItem(CLAVES_LOCALSTORAGE.ULTIMA_RUTA);
    localStorage.removeItem(CLAVES_LOCALSTORAGE.USUARIO_TEMPORAL);
  }

  /**
   * Obtiene la URL del último path visitado
   * @returns Última ruta o '/' por defecto
   */
  obtenerUltimaRuta(): string {
    return localStorage.getItem(CLAVES_LOCALSTORAGE.ULTIMA_RUTA) || '/';
  }

  /**
   * Almacena la ruta actual para restaurarla después del login
   * @param ruta - Ruta a almacenar
   */
  almacenarUltimaRuta(ruta: string): void {
    localStorage.setItem(CLAVES_LOCALSTORAGE.ULTIMA_RUTA, ruta);
  }
}

// Instancia singleton del servicio
export const authService = new AuthService();

// ==========================================
// UTILIDADES ADICIONALES
// ==========================================

/**
 * Configura el interceptor de Axios para incluir el token automáticamente
 */
export const configurarInterceptorAuth = () => {
  // Request interceptor - agregar token a todas las peticiones
  backofficeApi.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(CLAVES_LOCALSTORAGE.TOKEN_ACCESO);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - manejar tokens expirados
  backofficeApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem(CLAVES_LOCALSTORAGE.TOKEN_REFRESH);

        if (refreshToken) {
          try {
            // Intentar renovar el token
            const respuesta = await authService.renovarToken(refreshToken);

            // Actualizar el token en localStorage
            localStorage.setItem(CLAVES_LOCALSTORAGE.TOKEN_ACCESO, respuesta.accessToken);
            localStorage.setItem(CLAVES_LOCALSTORAGE.EXPIRACION_TOKEN, respuesta.expiration.toString());

            // Reintentar la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${respuesta.accessToken}`;
            return backofficeApi(originalRequest);

          } catch (refreshError) {
            // Si la renovación falla, limpiar sesión y redirigir al login
            authService.limpiarSesion();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          // Sin refresh token, limpiar sesión
          authService.limpiarSesion();
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};

