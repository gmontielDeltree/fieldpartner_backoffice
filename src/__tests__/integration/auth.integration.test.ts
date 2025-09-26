/**
 * Tests de integración para el sistema de autenticación en español
 * Prueba la comunicación entre frontend y backend español
 */
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../../store/auth/authSlice';
import { useAuthStore } from '../../hooks/useAuthStore';
import { authService } from '../../services/authService';
import { UsuarioLoginDto, CanalAutenticacion } from '../../types/auth.types';

// Mock del servicio de auth
jest.mock('../../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Helper para crear store de prueba
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    }
  });
};

// Helper para renderizar hook con store
const renderAuthHook = () => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(() => useAuthStore(), { wrapper });
};

describe('Integración de Autenticación Español', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Limpiar localStorage
    localStorage.clear();
  });

  describe('Login con Backend Español', () => {

    test('debe iniciar sesión exitosamente con credenciales válidas', async () => {
      // Arrange
      const credencialesValidas: UsuarioLoginDto = {
        email: 'admin@fieldpartner.com',
        password: 'Admin123!'
      };

      const respuestaLoginMock = {
        accessToken: 'token-acceso-mock',
        refreshToken: 'token-refresh-mock',
        expiration: Date.now() + 3600000,
        usuario: {
          id: '1',
          nombreUsuario: 'Admin Principal',
          email: 'admin@fieldpartner.com',
          esAdmin: true,
          esActivo: true,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        }
      };

      mockAuthService.login.mockResolvedValue(respuestaLoginMock);
      mockAuthService.almacenarSesion.mockImplementation(() => {});

      const { result } = renderAuthHook();

      // Act
      await act(async () => {
        await result.current.iniciarSesion(credencialesValidas);
      });

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(
        credencialesValidas,
        CanalAutenticacion.BACKOFFICE
      );
      expect(mockAuthService.almacenarSesion).toHaveBeenCalledWith(respuestaLoginMock);
      expect(result.current.usuario).toEqual(respuestaLoginMock.usuario);
      expect(result.current.status).toBe('authenticated');
      expect(result.current.isLoading).toBe(false);
    });

    test('debe manejar errores de login con credenciales inválidas', async () => {
      // Arrange
      const credencialesInvalidas: UsuarioLoginDto = {
        email: 'usuario@inexistente.com',
        password: 'contraseña-incorrecta'
      };

      const errorLogin = new Error('Usuario o contraseña incorrectos');
      mockAuthService.login.mockRejectedValue(errorLogin);

      const { result } = renderAuthHook();

      // Act
      await act(async () => {
        await result.current.iniciarSesion(credencialesInvalidas);
      });

      // Assert
      expect(result.current.errorMessage).toBe('Usuario o contraseña incorrectos');
      expect(result.current.status).toBe('not-authenticated');
      expect(result.current.usuario).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    test('debe validar canal de autenticación BACKOFFICE', async () => {
      // Arrange
      const credenciales: UsuarioLoginDto = {
        email: 'test@test.com',
        password: 'test123'
      };

      mockAuthService.login.mockResolvedValue({} as any);

      const { result } = renderAuthHook();

      // Act
      await act(async () => {
        await result.current.iniciarSesion(credenciales);
      });

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(
        credenciales,
        CanalAutenticacion.BACKOFFICE
      );
    });

  });

  describe('Verificación de Token Español', () => {

    test('debe verificar token válido y restaurar sesión', async () => {
      // Arrange
      const sesionMock = {
        tokenAcceso: 'token-valido',
        tokenRefresh: 'refresh-valido',
        usuario: JSON.stringify({
          id: '1',
          nombreUsuario: 'Usuario Test',
          email: 'test@test.com'
        })
      };

      const usuarioMock = {
        id: '1',
        nombreUsuario: 'Usuario Test',
        email: 'test@test.com'
      };

      mockAuthService.recuperarSesion.mockReturnValue(sesionMock);
      mockAuthService.tokenHaExpirado.mockReturnValue(false);
      mockAuthService.obtenerUltimaRuta.mockReturnValue('/home');

      const { result } = renderAuthHook();

      // Act
      await act(async () => {
        await result.current.verificarTokenAuth();
      });

      // Assert
      expect(mockAuthService.recuperarSesion).toHaveBeenCalled();
      expect(mockAuthService.tokenHaExpirado).toHaveBeenCalled();
      expect(result.current.usuario).toEqual(usuarioMock);
      expect(result.current.status).toBe('authenticated');
    });

    test('debe renovar token expirado automáticamente', async () => {
      // Arrange
      const sesionMock = {
        tokenAcceso: 'token-expirado',
        tokenRefresh: 'refresh-valido',
        usuario: JSON.stringify({ id: '1', nombreUsuario: 'Test' })
      };

      const respuestaRenovacion = {
        accessToken: 'nuevo-token',
        expiration: Date.now() + 3600000
      };

      mockAuthService.recuperarSesion.mockReturnValue(sesionMock);
      mockAuthService.tokenHaExpirado.mockReturnValue(true);
      mockAuthService.renovarToken.mockResolvedValue(respuestaRenovacion);
      mockAuthService.obtenerUltimaRuta.mockReturnValue('/home');

      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: jest.fn()
        }
      });

      const { result } = renderAuthHook();

      // Act
      await act(async () => {
        await result.current.verificarTokenAuth();
      });

      // Assert
      expect(mockAuthService.renovarToken).toHaveBeenCalledWith('refresh-valido');
      expect(localStorage.setItem).toHaveBeenCalledWith('t_bo', 'nuevo-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('t_exp_bo', respuestaRenovacion.expiration.toString());
    });

  });

  describe('Cerrar Sesión', () => {

    test('debe cerrar sesión y limpiar datos locales', () => {
      // Arrange
      mockAuthService.limpiarSesion.mockImplementation(() => {});

      const { result } = renderAuthHook();

      // Act
      act(() => {
        result.current.cerrarSesion();
      });

      // Assert
      expect(mockAuthService.limpiarSesion).toHaveBeenCalled();
      expect(result.current.status).toBe('not-authenticated');
      expect(result.current.usuario).toBeNull();
    });

  });

});