/**
 * Hook principal para gestión de cuentas
 * Integra con el servicio de licencias existente
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CuentaDto,
  CrearCuentaDto,
  ActualizarCuentaDto,
  RespuestaCrearCuenta,
  UsuarioCuentaDto,
  CompaniaDto,
  AgregarUsuarioACuentaDto,
  FiltrosCuentasDto,
  EstadoCuentasHook,
  AccionesCuentasHook,
  CategoriaCuenta,
  EstadoCuenta
} from '../types';
import { cuentasService, CuentasServiceError } from '../services/cuentasService';
import { useLicencias } from '../../licencias/hooks/useLicencias'; // Integración con servicio existente

/**
 * Hook principal para gestión de cuentas
 */
export const useCuentas = (): EstadoCuentasHook & AccionesCuentasHook => {
  // ============================
  // ESTADOS
  // ============================
  const [cuentas, setCuentas] = useState<CuentaDto[]>([]);
  const [cuentaActiva, setCuentaActiva] = useState<CuentaDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paginacion, setPaginacion] = useState(null);
  const [filtros, setFiltros] = useState<FiltrosCuentasDto>({});

  // ============================
  // HOOKS EXTERNOS
  // ============================
  const navigate = useNavigate();

  // Integración con el servicio de licencias existente
  const {
    licencias,
    cargarLicencias,
    isLoading: licenciasLoading
  } = useLicencias();

  // ============================
  // FUNCIONES AUXILIARES
  // ============================

  /**
   * Manejo centralizado de errores
   */
  const manejarError = useCallback((error: any, accion: string) => {
    console.error(`Error en ${accion}:`, error);

    if (error instanceof CuentasServiceError) {
      setError(error.message);
    } else {
      setError(`Error ${accion}: ${error.message || 'Error desconocido'}`);
    }

    setIsLoading(false);
  }, []);

  /**
   * Limpiar errores
   */
  const limpiarErrores = useCallback(() => {
    setError(null);
  }, []);

  // ============================
  // FUNCIONES PRINCIPALES
  // ============================

  /**
   * Cargar lista de cuentas con filtros
   */
  const cargarCuentas = useCallback(async (filtrosPersonalizados?: FiltrosCuentasDto) => {
    setIsLoading(true);
    limpiarErrores();

    try {
      const filtrosAUsar = filtrosPersonalizados || filtros;
      const cuentasObtenidas = await cuentasService.obtenerCuentas(filtrosAUsar);
      setCuentas(cuentasObtenidas);
      setFiltros(filtrosAUsar);
    } catch (error) {
      manejarError(error, 'cargar cuentas');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  /**
   * Buscar cuenta por ID
   */
  const buscarCuentaPorId = useCallback(async (cuentaId: string): Promise<CuentaDto | null> => {
    try {
      const cuenta = await cuentasService.obtenerCuentaPorCuentaId(cuentaId);
      return cuenta;
    } catch (error) {
      manejarError(error, 'buscar cuenta por ID');
      return null;
    }
  }, [manejarError]);

  /**
   * Buscar cuenta por referencia
   */
  const buscarCuentaPorReferencia = useCallback(async (referencia: string): Promise<CuentaDto | null> => {
    try {
      const cuenta = await cuentasService.buscarCuentaPorReferencia(referencia);
      return cuenta;
    } catch (error) {
      manejarError(error, 'buscar cuenta por referencia');
      return null;
    }
  }, [manejarError]);

  /**
   * Crear nueva cuenta
   */
  const crearCuenta = useCallback(async (datos: CrearCuentaDto): Promise<RespuestaCrearCuenta> => {
    setIsLoading(true);
    limpiarErrores();

    try {
      const respuesta = await cuentasService.crearCuenta(datos);

      // Recargar lista de cuentas después de crear
      await cargarCuentas();

      return respuesta;
    } catch (error) {
      manejarError(error, 'crear cuenta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cargarCuentas, limpiarErrores, manejarError]);

  /**
   * Actualizar cuenta existente
   */
  const actualizarCuenta = useCallback(async (
    cuentaId: string,
    datos: ActualizarCuentaDto
  ): Promise<CuentaDto> => {
    setIsLoading(true);
    limpiarErrores();

    try {
      const cuentaActualizada = await cuentasService.actualizarCuenta(cuentaId, datos);

      // Actualizar en la lista local
      setCuentas(prevCuentas =>
        prevCuentas.map(cuenta =>
          cuenta.cuentaId === cuentaId ? cuentaActualizada : cuenta
        )
      );

      // Actualizar cuenta activa si corresponde
      if (cuentaActiva?.cuentaId === cuentaId) {
        setCuentaActiva(cuentaActualizada);
      }

      return cuentaActualizada;
    } catch (error) {
      manejarError(error, 'actualizar cuenta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cuentaActiva, manejarError]);

  /**
   * Desactivar cuenta
   */
  const desactivarCuenta = useCallback(async (cuentaId: string): Promise<CuentaDto> => {
    setIsLoading(true);
    limpiarErrores();

    try {
      const cuentaDesactivada = await cuentasService.desactivarCuenta(cuentaId);

      // Actualizar en la lista local
      setCuentas(prevCuentas =>
        prevCuentas.map(cuenta =>
          cuenta.cuentaId === cuentaId ? cuentaDesactivada : cuenta
        )
      );

      // Limpiar cuenta activa si era la desactivada
      if (cuentaActiva?.cuentaId === cuentaId) {
        setCuentaActiva(null);
      }

      return cuentaDesactivada;
    } catch (error) {
      manejarError(error, 'desactivar cuenta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cuentaActiva, manejarError]);

  /**
   * Obtener usuarios de una cuenta (categoría A)
   */
  const obtenerUsuariosDeCuenta = useCallback(async (cuentaId: string): Promise<UsuarioCuentaDto[]> => {
    try {
      return await cuentasService.obtenerUsuariosDeCuenta(cuentaId);
    } catch (error) {
      manejarError(error, 'obtener usuarios de la cuenta');
      return [];
    }
  }, [manejarError]);

  /**
   * Obtener usuario admin de una cuenta (categorías B/C)
   */
  const obtenerUsuarioAdminDeCuenta = useCallback(async (cuentaId: string): Promise<UsuarioCuentaDto> => {
    try {
      const usuario = await cuentasService.obtenerUsuarioAdminDeCuenta(cuentaId);
      if (!usuario) {
        throw new Error('No se encontró usuario admin para la cuenta');
      }
      return usuario;
    } catch (error) {
      manejarError(error, 'obtener usuario admin de la cuenta');
      throw error;
    }
  }, [manejarError]);

  /**
   * Obtener compañías de una cuenta
   */
  const obtenerCompaniasDeCuenta = useCallback(async (cuentaId: string): Promise<CompaniaDto[]> => {
    try {
      return await cuentasService.obtenerCompaniasDeCuenta(cuentaId);
    } catch (error) {
      manejarError(error, 'obtener compañías de la cuenta');
      return [];
    }
  }, [manejarError]);

  /**
   * Agregar usuario existente a cuenta (solo categoría A)
   */
  const agregarUsuarioACuenta = useCallback(async (
    cuentaId: string,
    datos: AgregarUsuarioACuentaDto
  ): Promise<void> => {
    setIsLoading(true);
    limpiarErrores();

    try {
      await cuentasService.agregarUsuarioACuenta(cuentaId, datos);

      // Recargar datos de la cuenta si es necesario
      if (cuentaActiva?.cuentaId === cuentaId) {
        const cuentaActualizada = await buscarCuentaPorId(cuentaId);
        if (cuentaActualizada) {
          setCuentaActiva(cuentaActualizada);
        }
      }
    } catch (error) {
      manejarError(error, 'agregar usuario a la cuenta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cuentaActiva, buscarCuentaPorId, manejarError]);

  /**
   * Validar disponibilidad de referencia
   */
  const validarReferencia = useCallback(async (referencia: string): Promise<boolean> => {
    try {
      return await cuentasService.validarReferenciaCuentaDisponible(referencia);
    } catch (error) {
      console.warn('Error validando referencia:', error);
      return false;
    }
  }, []);

  /**
   * Validar email de usuario
   */
  const validarEmailUsuario = useCallback(async (email: string): Promise<boolean> => {
    try {
      const resultado = await cuentasService.validarEmailUsuario(email);
      return resultado.disponible;
    } catch (error) {
      console.warn('Error validando email:', error);
      return false;
    }
  }, []);

  // ============================
  // FUNCIONES DE NAVEGACIÓN
  // ============================

  /**
   * Ir a crear nueva cuenta
   */
  const irACrearCuenta = useCallback(() => {
    navigate('/cuentas/crear');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Ir a editar cuenta
   */
  const irAEditarCuenta = useCallback((cuenta: CuentaDto) => {
    setCuentaActiva(cuenta);
    navigate(`/cuentas/editar/${cuenta.cuentaId}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Ir a detalle de la cuenta
   */
  const irADetalleCuenta = useCallback((cuenta: CuentaDto) => {
    setCuentaActiva(cuenta);
    navigate(`/cuentas/${cuenta.cuentaId}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================
  // FUNCIONES DE FILTRADO
  // ============================

  /**
   * Filtrar cuentas por categoría
   */
  const filtrarPorCategoria = useCallback((categoria: CategoriaCuenta) => {
    const nuevosFiltros = { ...filtros, categoria };
    cargarCuentas(nuevosFiltros);
  }, [filtros, cargarCuentas]);

  /**
   * Filtrar cuentas por estado
   */
  const filtrarPorEstado = useCallback((estado: EstadoCuenta) => {
    const nuevosFiltros = { ...filtros, estado };
    cargarCuentas(nuevosFiltros);
  }, [filtros, cargarCuentas]);

  /**
   * Buscar cuentas por término
   */
  const buscarCuentas = useCallback(async (termino: string) => {
    if (!termino.trim()) {
      cargarCuentas();
      return;
    }

    setIsLoading(true);
    try {
      const cuentasEncontradas = await cuentasService.buscarCuentas(termino, filtros);
      setCuentas(cuentasEncontradas);
    } catch (error) {
      manejarError(error, 'buscar cuentas');
    } finally {
      setIsLoading(false);
    }
  }, [filtros, cargarCuentas, manejarError]);

  // ============================
  // EFECTOS
  // ============================

  /**
   * Cargar licencias al inicializar (para usar en formularios)
   */
  useEffect(() => {
    if (licencias.length === 0 && !licenciasLoading) {
      cargarLicencias();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================
  // RETORNO DEL HOOK
  // ============================

  return {
    // Estados
    cuentas,
    cuentaActiva,
    isLoading: isLoading || licenciasLoading,
    error,
    paginacion,
    filtros,
    licencias,
    isLoadingLicencias: licenciasLoading,

    // Acciones principales
    cargarCuentas,
    buscarCuentaPorId,
    buscarCuentaPorReferencia,
    crearCuenta,
    actualizarCuenta,
    desactivarCuenta,
    obtenerUsuariosDeCuenta,
    obtenerUsuarioAdminDeCuenta,
    obtenerCompaniasDeCuenta,
    agregarUsuarioACuenta,

    // Validaciones
    validarReferencia,
    validarEmailUsuario,

    // Setters
    setCuentaActiva,
    setFiltros,
    limpiarErrores,

    // Navegación
    irACrearCuenta,
    irAEditarCuenta,
    irADetalleCuenta,

    // Filtros
    filtrarPorCategoria,
    filtrarPorEstado,
    buscarCuentas
  };
};