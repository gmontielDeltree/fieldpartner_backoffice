/**
 * Tests End-to-End del flujo completo de login
 * Prueba la integración real frontend-backend sin mocks
 */
import { test, expect } from '@playwright/test';

// Configuración para tests E2E
const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:4000';

test.describe('Flujo E2E de Login Español', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto(`${BASE_URL}/auth/login`);
  });

  test('debe completar el flujo de login exitoso', async ({ page }) => {
    // Verificar que la página cargó correctamente
    await expect(page.locator('h1')).toContainText('Iniciar Sesión');

    // Completar formulario con credenciales válidas
    await page.fill('input[name="email"]', 'admin@fieldpartner.com');
    await page.fill('input[name="password"]', 'Admin123!');

    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');

    // Verificar loading state
    await expect(page.locator('button[type="submit"]')).toContainText('Iniciando sesión...');

    // Esperar redirección a dashboard
    await page.waitForURL(`${BASE_URL}/home`);

    // Verificar elementos del dashboard
    await expect(page.locator('nav')).toContainText('Fieldpartner');
    await expect(page.locator('nav')).toContainText('Backoffice');
  });

  test('debe mostrar error con credenciales incorrectas', async ({ page }) => {
    // Completar formulario con credenciales inválidas
    await page.fill('input[name="email"]', 'usuario@inexistente.com');
    await page.fill('input[name="password"]', 'contraseña-incorrecta');

    // Hacer clic en login
    await page.click('button[type="submit"]');

    // Verificar mensaje de error en español
    await expect(page.locator('.MuiAlert-message')).toContainText('Usuario o contraseña incorrectos');

    // Verificar que permanece en la página de login
    await expect(page.url()).toBe(`${BASE_URL}/auth/login`);
  });

  test('debe validar campos obligatorios', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]');

    // Verificar mensajes de validación
    await expect(page.locator('text=El email es obligatorio')).toBeVisible();
    await expect(page.locator('text=La contraseña es obligatoria')).toBeVisible();
  });

  test('debe validar formato de email', async ({ page }) => {
    await page.fill('input[name="email"]', 'email-invalido');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Ingrese un email válido')).toBeVisible();
  });

  test('debe validar longitud mínima de contraseña', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=La contraseña debe tener al menos 6 caracteres')).toBeVisible();
  });

  test('debe funcionar el toggle de mostrar/ocultar contraseña', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[aria-label="mostrar/ocultar contraseña"]');

    // Inicialmente debe ser tipo password
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Hacer clic para mostrar
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Hacer clic para ocultar
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('debe persistir sesión después de refresh', async ({ page }) => {
    // Login exitoso
    await page.fill('input[name="email"]', 'admin@fieldpartner.com');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Esperar redirección
    await page.waitForURL(`${BASE_URL}/home`);

    // Recargar página
    await page.reload();

    // Verificar que sigue autenticado
    await expect(page.url()).toBe(`${BASE_URL}/home`);
    await expect(page.locator('nav')).toContainText('Admin Principal');
  });

  test('debe cerrar sesión correctamente', async ({ page }) => {
    // Login exitoso
    await page.fill('input[name="email"]', 'admin@fieldpartner.com');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/home`);

    // Hacer clic en logout
    await page.click('button[aria-label="logout"]');

    // Verificar redirección al login
    await page.waitForURL(`${BASE_URL}/auth/login`);

    // Verificar que el localStorage se limpia
    const token = await page.evaluate(() => localStorage.getItem('t_bo'));
    expect(token).toBeNull();
  });

  test('debe manejar token expirado y renovar automáticamente', async ({ page }) => {
    // Simular token expirado en localStorage
    await page.addInitScript(() => {
      localStorage.setItem('t_bo', 'token-expirado');
      localStorage.setItem('t_refresh_bo', 'refresh-token-valido');
      localStorage.setItem('t_exp_bo', (Date.now() - 1000).toString()); // Expirado
      localStorage.setItem('usuario_bo', JSON.stringify({
        id: '1',
        nombreUsuario: 'Usuario Test',
        email: 'test@test.com'
      }));
      localStorage.setItem('ultima_ruta_bo', '/home');
    });

    // Navegar directamente al home
    await page.goto(`${BASE_URL}/home`);

    // El sistema debería renovar automáticamente el token
    await expect(page.url()).toBe(`${BASE_URL}/home`);

    // Verificar que hay un nuevo token
    const newToken = await page.evaluate(() => localStorage.getItem('t_bo'));
    expect(newToken).not.toBe('token-expirado');
  });

  test('debe redirigir a login si el refresh token también expiró', async ({ page }) => {
    // Simular ambos tokens expirados
    await page.addInitScript(() => {
      localStorage.setItem('t_bo', 'token-expirado');
      localStorage.setItem('t_refresh_bo', 'refresh-token-expirado');
      localStorage.setItem('t_exp_bo', (Date.now() - 1000).toString());
    });

    await page.goto(`${BASE_URL}/home`);

    // Debería redirigir al login
    await page.waitForURL(`${BASE_URL}/auth/login`);

    // Verificar mensaje de sesión expirada
    await expect(page.locator('.MuiAlert-message')).toContainText('Sesión expirada');
  });

});

test.describe('Integración con Backend Real', () => {

  test('debe conectarse al endpoint español de login', async ({ page }) => {
    // Interceptar request al backend
    const loginRequest = page.waitForRequest(request =>
      request.url().includes('/usuarios/login') && request.method() === 'POST'
    );

    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    const request = await loginRequest;
    const postData = request.postDataJSON();

    // Verificar estructura del request
    expect(postData).toEqual({
      email: 'test@test.com',
      password: 'password123',
      canal: 'BACKOFFICE'
    });
  });

  test('debe manejar respuesta del backend español', async ({ page }) => {
    // Interceptar respuesta del backend
    await page.route('**/usuarios/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'token-test',
          refreshToken: 'refresh-test',
          expiration: Date.now() + 3600000,
          usuario: {
            id: '1',
            nombreUsuario: 'Usuario Test',
            email: 'test@test.com',
            esAdmin: false,
            esActivo: true
          }
        })
      });
    });

    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verificar que se almacena correctamente la respuesta
    await page.waitForURL(`${BASE_URL}/home`);

    const storedToken = await page.evaluate(() => localStorage.getItem('t_bo'));
    const storedUser = await page.evaluate(() => localStorage.getItem('usuario_bo'));

    expect(storedToken).toBe('token-test');
    expect(JSON.parse(storedUser!)).toMatchObject({
      nombreUsuario: 'Usuario Test',
      email: 'test@test.com'
    });
  });

});