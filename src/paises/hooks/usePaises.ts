/**
 * Hook para gestión de países
 * Siguiendo el patrón de clientes/licencias con useState
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
  PaisDto,
  CrearPaisDto,
  ActualizarPaisDto,
  FiltrosPaisesDto
} from '../types';
import { RUTAS_PAISES } from '../../shared/constants/routes';
import {
  obtenerPaises,
  // obtenerPaisPorId,
  // obtenerPaisPorCodigo,
  crearPais,
  actualizarPais,
  eliminarPais,
  buscarPaises,
  obtenerPaisesParaDropdown
} from '../services';

// ============================
// INTERFACE DEL HOOK
// ============================

interface UsePaisesReturn {
  // Estado
  paises: PaisDto[];
  paisActivo: PaisDto | null;
  isLoading: boolean;
  error: string | null;
  filtros: FiltrosPaisesDto;

  // Métodos de carga
  cargarPaises: (filtrosPaises?: FiltrosPaisesDto) => Promise<void>;
  buscarPaises: (termino: string) => Promise<void>;
  obtenerPaisParaDropdown: () => Promise<Array<{value: string, label: string}>>;

  // Métodos CRUD
  crearPais: (paisData: CrearPaisDto) => Promise<void>;
  actualizarPais: (paisId: string, paisData: ActualizarPaisDto) => Promise<void>;
  eliminarPais: (paisId: string) => Promise<void>;

  // Métodos de navegación
  irACrearPais: () => void;
  irAEditarPais: (pais: PaisDto) => void;
  irADetallePais: (pais: PaisDto) => void;
  irAListaPaises: () => void;

  // Métodos de estado
  setPaisActivo: (pais: PaisDto | null) => void;
  setFiltros: (filtros: FiltrosPaisesDto) => void;
  limpiarErrores: () => void;
  limpiarEstado: () => void;
}

// ============================
// HOOK PRINCIPAL
// ============================

export const usePaises = (): UsePaisesReturn => {
  // ============================
  // ESTADO
  // ============================

  const [paises, setPaises] = useState<PaisDto[]>([]);
  const [paisActivo, setPaisActivo] = useState<PaisDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosPaisesDto>({});

  const navigate = useNavigate();

  // ============================
  // MÉTODOS DE CARGA
  // ============================

  /**
   * Cargar todos los países
   */
  const cargarPaises = useCallback(async (filtrosPaises?: FiltrosPaisesDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const paisesData = await obtenerPaises();
      setPaises(paisesData);

      if (filtrosPaises) {
        setFiltros(filtrosPaises);
      }
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error al cargar países';
      setError(mensajeError);
      console.error('Error en cargarPaises:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar países por término
   */
  const buscarPaisesFunc = useCallback(async (termino: string) => {
    if (!termino.trim()) {
      await cargarPaises();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filtrosBusqueda: FiltrosPaisesDto = {
        descripcion: termino
      };

      const paisesEncontrados = await buscarPaises(filtrosBusqueda);
      setPaises(paisesEncontrados);
      setFiltros(filtrosBusqueda);
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error al buscar países';
      setError(mensajeError);
      console.error('Error en buscarPaises:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cargarPaises]);

  /**
   * Obtener países para dropdown
   */
  const obtenerPaisParaDropdown = useCallback(async () => {
    try {
      return await obtenerPaisesParaDropdown();
    } catch (error) {
      console.error('Error al obtener países para dropdown:', error);
      return [];
    }
  }, []);

  // ============================
  // MÉTODOS CRUD
  // ============================

  /**
   * Crear nuevo país
   */
  const crearPaisFunc = useCallback(async (paisData: CrearPaisDto) => {
    setIsLoading(true);
    setError(null);

    try {
      await crearPais(paisData);

      Swal.fire({
        title: '¡País creado exitosamente!',
        text: `El país "${paisData.descripcionES}" ha sido registrado`,
        icon: 'success',
        confirmButtonText: 'Continuar'
      });

      // Recargar la lista de países
      // await cargarPaises();
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error al crear país';
      setError(mensajeError);

      Swal.fire({
        title: 'Error al crear país',
        text: mensajeError,
        icon: 'error',
        confirmButtonText: 'Continuar'
      });

      console.error('Error en crearPais:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Actualizar país existente
   */
  const actualizarPaisFunc = useCallback(async (paisId: string, paisData: ActualizarPaisDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const paisActualizado = await actualizarPais(paisId, paisData);

      Swal.fire({
        title: '¡País actualizado exitosamente!',
        text: `El país "${paisActualizado.descripcionES}" ha sido actualizado`,
        icon: 'success',
        confirmButtonText: 'Continuar'
      });

      // Actualizar la lista local
      setPaises(prevPaises =>
        prevPaises.map(pais =>
          pais.id === paisId ? paisActualizado : pais
        )
      );

      // Actualizar país activo si corresponde
      if (paisActivo?.id === paisId) {
        setPaisActivo(paisActualizado);
      }
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error al actualizar país';
      setError(mensajeError);

      Swal.fire({
        title: 'Error al actualizar país',
        text: mensajeError,
        icon: 'error',
        confirmButtonText: 'Continuar'
      });

      console.error('Error en actualizarPais:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [paisActivo]);

  /**
   * Eliminar país
   */
  const eliminarPaisFunc = useCallback(async (paisId: string) => {
    const paisAEliminar = paises.find(p => p.id === paisId);

    if (!paisAEliminar) {
      setError('País no encontrado');
      return;
    }

    const confirmacion = await Swal.fire({
      title: '¿Eliminar país?',
      text: `¿Está seguro que desea eliminar "${paisAEliminar.descripcionES}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await eliminarPais(paisId);

      Swal.fire({
        title: '¡País eliminado!',
        text: `"${paisAEliminar.descripcionES}" ha sido eliminado exitosamente`,
        icon: 'success',
        confirmButtonText: 'Continuar'
      });

      // Actualizar la lista local
      setPaises(prevPaises => prevPaises.filter(pais => pais.id !== paisId));

      // Limpiar país activo si es el que se eliminó
      if (paisActivo?.id === paisId) {
        setPaisActivo(null);
      }
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Error al eliminar país';
      setError(mensajeError);

      Swal.fire({
        title: 'Error al eliminar país',
        text: mensajeError,
        icon: 'error',
        confirmButtonText: 'Continuar'
      });

      console.error('Error en eliminarPais:', error);
    } finally {
      setIsLoading(false);
    }
  }, [paises, paisActivo]);

  // ============================
  // MÉTODOS DE NAVEGACIÓN
  // ============================

  /**
   * Navegar a crear país
   */
  const irACrearPais = useCallback(() => {
    setPaisActivo(null);
    navigate(RUTAS_PAISES.CREAR);
  }, [navigate]);

  /**
   * Navegar a editar país
   */
  const irAEditarPais = useCallback((pais: PaisDto) => {
    setPaisActivo(pais);
    navigate(`${RUTAS_PAISES.EDITAR.replace(':id', pais.codigo)}`);
  }, [navigate]);

  /**
   * Navegar a detalle de país
   */
  const irADetallePais = useCallback((pais: PaisDto) => {
    setPaisActivo(pais);
    navigate(`${RUTAS_PAISES.DETALLE.replace(':id', pais.codigo)}`);
  }, [navigate]);

  /**
   * Navegar a lista de países
   */
  const irAListaPaises = useCallback(() => {
    navigate(RUTAS_PAISES.LISTA);
  }, [navigate]);

  // ============================
  // MÉTODOS DE ESTADO
  // ============================

  /**
   * Limpiar errores
   */
  const limpiarErrores = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar todo el estado
   */
  const limpiarEstado = useCallback(() => {
    setPaises([]);
    setPaisActivo(null);
    setError(null);
    setFiltros({});
    setIsLoading(false);
  }, []);

  // ============================
  // RETURN DEL HOOK
  // ============================

  return {
    // Estado
    paises,
    paisActivo,
    isLoading,
    error,
    filtros,

    // Métodos de carga
    cargarPaises,
    buscarPaises: buscarPaisesFunc,
    obtenerPaisParaDropdown,

    // Métodos CRUD
    crearPais: crearPaisFunc,
    actualizarPais: actualizarPaisFunc,
    eliminarPais: eliminarPaisFunc,

    // Métodos de navegación
    irACrearPais,
    irAEditarPais,
    irADetallePais,
    irAListaPaises,

    // Métodos de estado
    setPaisActivo,
    setFiltros,
    limpiarErrores,
    limpiarEstado
  };
};