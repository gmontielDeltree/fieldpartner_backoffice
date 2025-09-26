/**
 * Tests de componente LoginPage con integración del sistema español
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { LoginPage } from '../../pages/LoginPage';
import { authSlice } from '../../store/auth/authSlice';
import { authService } from '../../services/authService';

// Mock del servicio
jest.mock('../../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Helper para renderizar con providers
const renderWithProviders = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginPage - Integración Sistema Español', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el formulario de login en español', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Accede a tu cuenta del backoffice')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('debe validar campos obligatorios en español', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Enviar formulario sin completar campos
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
    });
  });

  test('debe validar formato de email en español', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Ingresar email inválido
    await user.type(emailInput, 'email-invalido');
    await user.type(passwordInput, '123456');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ingrese un email válido')).toBeInTheDocument();
    });
  });

  test('debe validar longitud de contraseña en español', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Contraseña muy corta
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });
  });

  test('debe llamar al servicio de login español con datos correctos', async () => {
    const respuestaLoginMock = {
      accessToken: 'token-mock',
      refreshToken: 'refresh-mock',
      expiration: Date.now() + 3600000,
      usuario: {
        id: '1',
        nombreUsuario: 'Usuario Test',
        email: 'test@test.com',
        esAdmin: false,
        esActivo: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }
    };

    mockAuthService.login.mockResolvedValue(respuestaLoginMock);
    mockAuthService.almacenarSesion.mockImplementation(() => {});

    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Completar formulario
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith(
        {
          email: 'test@test.com',
          password: 'password123'
        },
        'BACKOFFICE'
      );
    });
  });

  test('debe mostrar mensaje de error en español cuando falla el login', async () => {
    const errorMock = new Error('Usuario o contraseña incorrectos');
    mockAuthService.login.mockRejectedValue(errorMock);

    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'usuario@inexistente.com');
    await user.type(passwordInput, 'contraseña-incorrecta');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
    });
  });

  test('debe mostrar indicador de carga durante el login', async () => {
    // Mock que tarda en resolver
    mockAuthService.login.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Verificar estado de carga
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('debe mostrar/ocultar contraseña al hacer clic en el icono', async () => {
    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getByRole('button', { name: /mostrar\/ocultar contraseña/i });

    // Inicialmente debe ser tipo password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Hacer clic para mostrar
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Hacer clic para ocultar
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('debe normalizar email a minúsculas antes de enviar', async () => {
    mockAuthService.login.mockResolvedValue({} as any);
    mockAuthService.almacenarSesion.mockImplementation(() => {});

    renderWithProviders(<LoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Ingresar email con mayúsculas
    await user.type(emailInput, 'TEST@EXAMPLE.COM');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123'
        },
        'BACKOFFICE'
      );
    });
  });

});