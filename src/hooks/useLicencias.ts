import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  obtenerLicencias,
  obtenerLicenciaPorId,
  crearLicencia,
  actualizarLicencia,
  asignarLicenciaACliente,
  obtenerLicenciasDeCliente,
  buscarLicencias,
  establecerLicenciaActiva,
  limpiarLicenciaActiva,
  limpiarError,
  limpiarEstado,
} from '../store/licencias';
import {
  CrearLicenciaDto,
  ActualizarLicenciaDto,
  AsignarLicenciaClienteDto,
  Licencia,
} from '../types/licencias.types';

export const useLicencias = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Selectors del estado
  const {
    licencias,
    licenciaActiva,
    licenciasPorCliente,
    isLoading,
    error,
  } = useAppSelector((state) => state.licencias);

  // 📋 OBTENER TODAS LAS LICENCIAS
  const cargarLicencias = useCallback(async () => {
    try {
      await dispatch(obtenerLicencias()).unwrap();
    } catch (error: any) {
      Swal.fire('Error', error || 'No se pudieron cargar las licencias', 'error');
    }
  }, [dispatch]);

  // 🔍 OBTENER LICENCIA POR ID
  const cargarLicenciaPorId = useCallback(async (id: string) => {
    try {
      await dispatch(obtenerLicenciaPorId(id)).unwrap();
    } catch (error: any) {
      Swal.fire('Error', error || 'No se pudo cargar la licencia', 'error');
    }
  }, [dispatch]);

  // ➕ CREAR NUEVA LICENCIA
  const crearNuevaLicencia = useCallback(async (licenciaData: CrearLicenciaDto) => {
    try {
      await dispatch(crearLicencia(licenciaData)).unwrap();
      Swal.fire('Éxito', 'Licencia creada correctamente', 'success');
      navigate('/licencias');
      return true;
    } catch (error: any) {
      Swal.fire('Error', error || 'No se pudo crear la licencia', 'error');
      return false;
    }
  }, [dispatch, navigate]);

  // ✏️ ACTUALIZAR LICENCIA
  const actualizarLicenciaExistente = useCallback(async (
    id: string,
    datos: ActualizarLicenciaDto
  ) => {
    try {
      await dispatch(actualizarLicencia({ id, datos })).unwrap();
      Swal.fire('Éxito', 'Licencia actualizada correctamente', 'success');
      navigate('/licencias');
      return true;
    } catch (error: any) {
      Swal.fire('Error', error || 'No se pudo actualizar la licencia', 'error');
      return false;
    }
  }, [dispatch, navigate]);

  // 🔗 ASIGNAR LICENCIA A CLIENTE
  const asignarLicencia = useCallback(async (datos: AsignarLicenciaClienteDto) => {
    try {
      await dispatch(asignarLicenciaACliente(datos)).unwrap();
      Swal.fire('Éxito', 'Licencia asignada al cliente correctamente', 'success');
      return true;
    } catch (error: any) {
      Swal.fire('Error', error || 'No se pudo asignar la licencia', 'error');
      return false;
    }
  }, [dispatch]);

  // 👥 OBTENER LICENCIAS DE UN CLIENTE
  const cargarLicenciasDeCliente = useCallback(async (clienteId: string) => {
    try {
      await dispatch(obtenerLicenciasDeCliente(clienteId)).unwrap();
    } catch (error: any) {
      Swal.fire('Error', error || 'No se pudieron cargar las licencias del cliente', 'error');
    }
  }, [dispatch]);

  // 🔍 BUSCAR LICENCIAS CON FILTROS
  const buscarLicenciasConFiltros = useCallback(async (filtros: {
    descripcion?: string;
    tipoLicencia?: string;
    tipoSistema?: string;
  }) => {
    try {
      await dispatch(buscarLicencias(filtros)).unwrap();
    } catch (error: any) {
      Swal.fire('Error', error || 'Error en la búsqueda de licencias', 'error');
    }
  }, [dispatch]);

  // 🎯 ESTABLECER LICENCIA ACTIVA
  const seleccionarLicencia = useCallback((licencia: Licencia) => {
    dispatch(establecerLicenciaActiva(licencia));
  }, [dispatch]);

  // 🧹 LIMPIAR LICENCIA ACTIVA
  const limpiarSeleccion = useCallback(() => {
    dispatch(limpiarLicenciaActiva());
  }, [dispatch]);

  // 🗑️ LIMPIAR ERROR
  const limpiarErrores = useCallback(() => {
    dispatch(limpiarError());
  }, [dispatch]);

  // 🔄 LIMPIAR TODO EL ESTADO
  const reiniciarEstado = useCallback(() => {
    dispatch(limpiarEstado());
  }, [dispatch]);

  // 🚀 NAVEGAR A NUEVA LICENCIA
  const irANuevaLicencia = useCallback(() => {
    limpiarSeleccion();
    navigate('/licencias/nueva');
  }, [navigate, limpiarSeleccion]);

  // ✏️ NAVEGAR A EDITAR LICENCIA
  const irAEditarLicencia = useCallback((licencia: Licencia) => {
    seleccionarLicencia(licencia);
    navigate(`/licencias/editar/${licencia.id}`);
  }, [navigate, seleccionarLicencia]);

  // 🔙 VOLVER A LISTA
  const volverALista = useCallback(() => {
    limpiarSeleccion();
    navigate('/licencias');
  }, [navigate, limpiarSeleccion]);

  // 🗑️ CONFIRMAR Y ELIMINAR (si se implementa en el backend)
  const confirmarEliminacion = useCallback(async (licencia: Licencia) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la licencia "${licencia.descripcion}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // TODO: Implementar eliminación cuando esté disponible en el backend
      Swal.fire('Información', 'Funcionalidad de eliminación pendiente de implementar', 'info');
    }
  }, []);

  return {
    // 📊 Estado
    licencias,
    licenciaActiva,
    licenciasPorCliente,
    isLoading,
    error,

    // 🔧 Métodos de datos
    cargarLicencias,
    cargarLicenciaPorId,
    crearNuevaLicencia,
    actualizarLicenciaExistente,
    asignarLicencia,
    cargarLicenciasDeCliente,
    buscarLicenciasConFiltros,

    // 🎯 Métodos de estado
    seleccionarLicencia,
    limpiarSeleccion,
    limpiarErrores,
    reiniciarEstado,

    // 🚀 Métodos de navegación
    irANuevaLicencia,
    irAEditarLicencia,
    volverALista,

    // 🗑️ Métodos de acciones
    confirmarEliminacion,
  };
};