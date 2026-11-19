import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { System } from '../types';
import { backofficeApi } from '../config';
import { backendErrorMessage } from '../utils/backendError';

/** Shape del SystemDto que devuelve el back en /systems. */
export interface SystemResponse {
  id: string;
  code: string;
  name: string;
  version: string | null;
  technicalDetails?: string | null;
}

export const systemFromResponse = (item: SystemResponse): System => ({
  id: item.id,
  code: item.code,
  system: item.name,
  version: item.version ?? '',
  technicalDetails: item.technicalDetails ?? '',
});

/** Rótulo de un sistema en selects y listados: "Nombre" o "Nombre: versión". */
export const systemLabel = (s?: Pick<System, 'system' | 'version'> | null) =>
  s ? (s.version ? `${s.system}: ${s.version}` : s.system) : '';

const toPayload = (system: System) => ({
  code: system.code.trim(),
  name: system.system.trim(),
  version: system.version || undefined,
  technicalDetails: system.technicalDetails || undefined,
});

export const useSystem = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [system, setSystem] = useState<System[]>([]);

  const getSystem = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<SystemResponse[]>('/systems');
      setSystem(response.data.map(systemFromResponse));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los sistemas.', 'error');
      setSystem([]);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSystem = async (newSystem: System) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/systems', toPayload(newSystem));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Sistema', 'Nuevo sistema agregado.', 'success');
        navigate('/system');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo crear el sistema.'), 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSystem = async (updatedSystem: System) => {
    if (!updatedSystem.id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/systems/${updatedSystem.id}`, toPayload(updatedSystem));
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Sistema', 'Actualizado.', 'success');
        navigate('/system');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo actualizar el sistema.'), 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSystem = async (systemId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/systems/${systemId}`);
      Swal.fire('Sistema', 'Eliminado.', 'success');
      await getSystem();
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        backendErrorMessage(error, 'No se pudo eliminar: puede tener licencias o menús asociados.'),
        'error',
      );
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    system,

    //* Métodos
    createSystem,
    getSystem,
    setSystem,
    updateSystem,
    removeSystem,
  };
};
