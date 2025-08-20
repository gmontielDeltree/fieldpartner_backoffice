import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Modules } from '../types';
import { dbContext } from '../services/pouchdbService';

export type ModuleOption = {
  id: string;
  label: string;
  value: Modules;
};

export const useModules = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modules, setModules] = useState<Modules[]>([]);

  const createModules = async (newModules: Modules) => {
    setIsLoading(true);
    try {
      const response = await dbContext.modules.post(newModules);

      setIsLoading(false);
      if (response.ok) Swal.fire(' Modulo', 'Nuevo  Modulo agregado.', 'success');
      else Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

      navigate('/modules');
    } catch (error) {
      console.log(error);
      Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const getModules = async () => {
    setIsLoading(true);
    try {
      const response = await dbContext.modules.allDocs({ include_docs: true });

      const normalize = (s?: string) =>
        (s ?? '')
          .toString()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

      const documents: Modules[] = response.rows
        .map(row => row.doc as Modules)
        .filter(Boolean)
        .sort((a, b) =>
          normalize(a.moduleNameEs).localeCompare(normalize(b.moduleNameEs), 'es', {
            sensitivity: 'base',
          }),
        );

      setModules(documents);
    } catch (error) {
      console.error(error);
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateModules = async (updateModules: Modules) => {
    setIsLoading(true);

    try {
      const response = await dbContext.modules.put(updateModules);
      setIsLoading(false);

      if (response.ok) Swal.fire('Modulo', 'Actualizado.', 'success');

      navigate('/modules');
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'No se encontraron Modulos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const removeModules = async (moduleId: string, revModule: string) => {
    setIsLoading(true);

    try {
      const response = await dbContext.modules.remove(moduleId, revModule);
      setIsLoading(false);

      if (response.ok) Swal.fire('Modulo', 'Eliminado.', 'success');

      navigate('/modules');
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'No se encontraron Modulos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const options: ModuleOption[] = useMemo(
    () =>
      (modules ?? []).map(m => ({
        id: m._id ?? m.moduleNameEs,
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
