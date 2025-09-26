/**
 * Hook para gestión de licencias con useState local
 * Siguiendo el patrón del módulo clientes
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { licenciasService } from '../services/licenciasService';
import {
  LicenciaDto,
  LicenciaPorClienteDto,
  CrearLicenciaDto,
  ActualizarLicenciaDto,
  AsignarLicenciaClienteDto,
  FiltrosLicenciasDto,
  EstadoLicenciasHook,
  AccionesLicenciasHook
} from '../types';

export const useLicencias = (): EstadoLicenciasHook & AccionesLicenciasHook => {
  const navigate = useNavigate();

  // Estado local usando useState
  const [licencias, setLicencias] = useState<LicenciaDto[]>([]);
  const [licenciaActiva, setLicenciaActiva] = useState<LicenciaDto | null>(null);
  const [licenciasPorCliente, setLicenciasPorCliente] = useState<LicenciaPorClienteDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosLicenciasDto>({});

  // Función para mostrar errores
  const mostrarError = useCallback((mensaje: string, titulo = 'Error') => {
    setError(mensaje);
    Swal.fire(titulo, mensaje, 'error');
  }, []);

  // Función para mostrar éxito
  const mostrarExito = useCallback((mensaje: string, titulo = 'Éxito') => {
    Swal.fire(titulo, mensaje, 'success');
  }, []);

  // ===============================
  // MÉTODOS DE DATOS
  // ===============================

  /**
   * Cargar todas las licencias
   */
  const cargarLicencias = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await licenciasService.obtenerLicencias(filtros);
      setLicencias(resultado);
    } catch (error: any) {
      const mensaje = error.message || 'No se pudieron cargar las licencias';
      mostrarError(mensaje);
    } finally {
      setIsLoading(false);
    }
  }, [filtros, mostrarError]);

  /**
   * Buscar licencia por ID
   */
  const buscarLicenciaPorId = useCallback(async (id: string): Promise<LicenciaDto | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const licencia = await licenciasService.obtenerLicenciaPorId(id);
      setLicenciaActiva(licencia);
      return licencia;
    } catch (error: any) {
      const mensaje = error.message || 'No se pudo cargar la licencia';
      mostrarError(mensaje);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError]);

  /**
   * Buscar licencia por código
   */
  const buscarLicenciaPorCodigo = useCallback(async (codigo: string): Promise<LicenciaDto | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await licenciasService.buscarLicenciaPorCodigo(codigo);
    } catch (error: any) {
      const mensaje = error.message || 'No se pudo buscar la licencia';
      mostrarError(mensaje);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError]);

  /**
   * Crear nueva licencia
   */
  const crearLicencia = useCallback(async (datos: CrearLicenciaDto): Promise<LicenciaDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const nuevaLicencia = await licenciasService.crearLicencia(datos);
      setLicencias(prevLicencias => [...prevLicencias, nuevaLicencia]);
      mostrarExito('Licencia creada correctamente');
      navigate('/licencias');
      return nuevaLicencia;
    } catch (error: any) {
      const mensaje = error.message || 'No se pudo crear la licencia';
      mostrarError(mensaje);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, mostrarError, mostrarExito]);

  /**
   * Actualizar licencia existente
   */
  const actualizarLicencia = useCallback(async (
    id: string,
    datos: ActualizarLicenciaDto
  ): Promise<LicenciaDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const licenciaActualizada = await licenciasService.actualizarLicencia(id, datos);

      // Actualizar en la lista
      setLicencias(prevLicencias =>
        prevLicencias.map(lic =>
          lic.id === id ? licenciaActualizada : lic
        )
      );

      // Actualizar licencia activa si corresponde
      if (licenciaActiva?.id === id) {
        setLicenciaActiva(licenciaActualizada);
      }

      mostrarExito('Licencia actualizada correctamente');
      navigate('/licencias');
      return licenciaActualizada;
    } catch (error: any) {
      const mensaje = error.message || 'No se pudo actualizar la licencia';
      mostrarError(mensaje);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [licenciaActiva, navigate, mostrarError, mostrarExito]);

  /**
   * Asignar licencia a cliente
   */
  const asignarLicenciaACliente = useCallback(async (
    datos: AsignarLicenciaClienteDto
  ): Promise<LicenciaPorClienteDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const asignacion = await licenciasService.asignarLicenciaACliente(datos);
      setLicenciasPorCliente(prevAsignaciones => [...prevAsignaciones, asignacion]);
      mostrarExito('Licencia asignada al cliente correctamente');
      return asignacion;
    } catch (error: any) {
      const mensaje = error.message || 'No se pudo asignar la licencia';
      mostrarError(mensaje);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError, mostrarExito]);

  /**
   * Obtener licencias de un cliente
   */
  const obtenerLicenciasDeCliente = useCallback(async (
    clienteId: string
  ): Promise<LicenciaPorClienteDto[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const licenciasCliente = await licenciasService.obtenerLicenciasDeCliente(clienteId);
      setLicenciasPorCliente(licenciasCliente);
      return licenciasCliente;
    } catch (error: any) {
      const mensaje = error.message || 'No se pudieron cargar las licencias del cliente';
      mostrarError(mensaje);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError]);

  /**
   * Obtener clientes con una licencia específica
   */
  const obtenerClientesConLicencia = useCallback(async (
    licenciaId: string
  ): Promise<LicenciaPorClienteDto[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await licenciasService.obtenerClientesConLicencia(licenciaId);
    } catch (error: any) {
      const mensaje = error.message || 'No se pudieron cargar los clientes con esta licencia';
      mostrarError(mensaje);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError]);

  /**
   * Desactivar licencia de un cliente
   */
  const desactivarLicenciaDeCliente = useCallback(async (
    clienteId: string,
    licenciaId: string
  ): Promise<LicenciaPorClienteDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const licenciaDesactivada = await licenciasService.desactivarLicenciaDeCliente(clienteId, licenciaId);

      // Actualizar en la lista de licencias por cliente
      setLicenciasPorCliente(prevLicencias =>
        prevLicencias.map(lic =>
          lic.clienteId === clienteId && lic.licenciaId === licenciaId
            ? licenciaDesactivada
            : lic
        )
      );

      mostrarExito('Licencia desactivada correctamente');
      return licenciaDesactivada;
    } catch (error: any) {
      const mensaje = error.message || 'No se pudo desactivar la licencia';
      mostrarError(mensaje);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError, mostrarExito]);

  // ===============================
  // MÉTODOS DE ESTADO
  // ===============================

  /**
   * Establecer licencia activa
   */
  const setLicenciaActivaMethod = useCallback((licencia: LicenciaDto | null) => {
    setLicenciaActiva(licencia);
  }, []);

  /**
   * Establecer filtros
   */
  const setFiltrosMethod = useCallback((nuevosFiltros: FiltrosLicenciasDto) => {
    setFiltros(nuevosFiltros);
  }, []);

  /**
   * Limpiar errores
   */
  const limpiarErrores = useCallback(() => {
    setError(null);
  }, []);

  // ===============================
  // MÉTODOS DE NAVEGACIÓN
  // ===============================

  /**
   * Ir a crear nueva licencia
   */
  const irACrearLicencia = useCallback(() => {
    setLicenciaActiva(null);
    navigate('/licencias/nueva');
  }, [navigate]);

  /**
   * Ir a editar licencia
   */
  const irAEditarLicencia = useCallback((licencia: LicenciaDto) => {
    setLicenciaActiva(licencia);
    navigate(`/licencias/editar/${licencia.id}`);
  }, [navigate]);

  /**
   * Ir a asignar licencia
   */
  const irAAsignarLicencia = useCallback((licencia: LicenciaDto) => {
    setLicenciaActiva(licencia);
    navigate(`/licencias/asignar/${licencia.id}`);
  }, [navigate]);

  // ===============================
  // MÉTODOS DE BÚSQUEDA
  // ===============================

  /**
   * Buscar licencias con término
   */
  const buscarLicencias = useCallback(async (termino: string) => {
    if (!termino.trim()) {
      await cargarLicencias();
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const resultados = await licenciasService.buscarLicencias(termino, filtros);
      setLicencias(resultados);
    } catch (error: any) {
      const mensaje = error.message || 'Error en la búsqueda de licencias';
      mostrarError(mensaje);
    } finally {
      setIsLoading(false);
    }
  }, [filtros, cargarLicencias, mostrarError]);

  return {
    // Estado
    licencias,
    licenciaActiva,
    licenciasPorCliente,
    isLoading,
    error,
    filtros,

    // Métodos de datos
    cargarLicencias,
    buscarLicenciaPorId,
    buscarLicenciaPorCodigo,
    crearLicencia,
    actualizarLicencia,
    asignarLicenciaACliente,
    obtenerLicenciasDeCliente,
    obtenerClientesConLicencia,
    desactivarLicenciaDeCliente,

    // Métodos de estado
    setLicenciaActiva: setLicenciaActivaMethod,
    setFiltros: setFiltrosMethod,
    limpiarErrores,

    // Métodos de navegación
    irACrearLicencia,
    irAEditarLicencia,
    irAAsignarLicencia,

    // Métodos de búsqueda
    buscarLicencias
  };
};