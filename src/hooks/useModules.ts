import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useState, useMemo } from 'react';
import { Modules } from '../types';
import { backofficeApi } from '../config';
import { backendErrorMessage } from '../utils/backendError';

export type ModuleOption = {
  id: string;
  label: string;
  value: Modules;
};

/** Shape del FeatureModuleDto que devuelve el back en /modules. */
interface ModuleResponse {
  id: string;
  nameEs: string;
  nameEn: string | null;
  namePt: string | null;
  icon: string | null;
  order: number;
}

const fromResponse = (item: ModuleResponse): Modules => ({
  id: item.id,
  moduleNameEs: item.nameEs,
  moduleNameEn: item.nameEn ?? '',
  moduleNamePt: item.namePt ?? '',
  icon: item.icon ?? '',
  orden: item.order,
});

const toPayload = (module: Modules) => ({
  nameEs: module.moduleNameEs.trim(),
  nameEn: module.moduleNameEn || undefined,
  namePt: module.moduleNamePt || undefined,
  icon: module.icon || undefined,
  order: Number(module.orden) || 0,
});

export const useModules = () => {
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<Modules[]>([]);

  // El back ya ordena por `order`; acá se reordena por nombre como hacía la versión PouchDB.
  const getModules = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<ModuleResponse[]>('/modules');
      const normalize = (s?: string) =>
        (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      setModules(
        response.data
          .map(fromResponse)
          .sort((a, b) =>
            normalize(a.moduleNameEs).localeCompare(normalize(b.moduleNameEs), 'es', {
              sensitivity: 'base',
            }),
          ),
      );
    } catch (error) {
      console.error(error);
      setModules([]);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createModules = async (newModule: Modules) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/modules', toPayload(newModule));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Módulo', 'Nuevo módulo agregado.', 'success');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo crear el módulo.'), 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateModules = async (updatedModule: Modules) => {
    if (!updatedModule.id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/modules/${updatedModule.id}`, toPayload(updatedModule));
      if (response.status === HttpStatusCode.Ok) Swal.fire('Módulo', 'Actualizado.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo actualizar el módulo.'), 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeModules = async (moduleId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/modules/${moduleId}`);
      Swal.fire('Módulo', 'Eliminado.', 'success');
      await getModules();
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        backendErrorMessage(error, 'No se pudo eliminar: puede tener menús asociados.'),
        'error',
      );
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const options: ModuleOption[] = useMemo(
    () =>
      (modules ?? []).map(m => ({
        id: m.id ?? m.moduleNameEs,
        label: m.moduleNameEs,
        value: m,
      })),
    [modules],
  );

  return {
    //* Propiedades
    error,
    isLoading,
    modules,
    options,

    //* Métodos
    createModules,
    getModules,
    setModules,
    updateModules,
    removeModules,
  };
};
