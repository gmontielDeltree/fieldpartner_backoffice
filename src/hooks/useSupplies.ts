import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SupplyType } from '../types';
import { backofficeApi } from '../config';

// Los radios del form guardan "true"/"false" como string; el back valida @IsBoolean.
const toPayload = (supply: SupplyType) => ({
  code: supply.code,
  descriptionES: supply.descriptionES,
  descriptionPT: supply.descriptionPT,
  descriptionEN: supply.descriptionEN,
  phytosanitary: String(supply.phytosanitary) === 'true',
  isCrop: String(supply.isCrop) === 'true',
});

export const useSupplies = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [supplies, setSupplies] = useState<SupplyType[]>([]);
  const [conceptoError, setConceptoError] = useState(false);

  const getSupplies = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<SupplyType[]>('/input-types');
      setSupplies(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se encontraron insumos.', 'error');
      setSupplies([]);
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSupplies = async (newSupplie: SupplyType) => {
    setIsLoading(true);

    if (!newSupplie.descriptionES.trim() || !newSupplie.code.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await backofficeApi.post('/input-types', toPayload(newSupplie));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Insumo', 'Nuevo Insumo agregado.', 'success');
        navigate('/type-supplies');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSupplie = async (updatedSupplie: SupplyType) => {
    const id = updatedSupplie.id;
    if (id === undefined || id === null) return;
    setIsLoading(true);

    if (!updatedSupplie.descriptionES.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await backofficeApi.patch(`/input-types/${id}`, toPayload(updatedSupplie));
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Insumo', 'Actualizado.', 'success');
        navigate('/type-supplies');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el insumo.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSupplie = async (supplieId: number) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/input-types/${supplieId}`);
      Swal.fire('Insumo', 'Eliminado.', 'success');
      getSupplies();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar el insumo.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /** Sin endpoint de búsqueda en el back: trae todo y filtra por código/descripciones. */
  const searchSupplies = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<SupplyType[]>('/input-types');
      const term = searchTerm.toLowerCase();
      const searchResults = response.data.filter(supply =>
        [supply.code, supply.descriptionES, supply.descriptionPT, supply.descriptionEN]
          .some(field => (field ?? '').toLowerCase().includes(term)),
      );
      setSupplies(searchResults);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error durante la búsqueda.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    supplies,
    conceptoError,

    //* Métodos
    createSupplies,
    getSupplies,
    setSupplies,
    updateSupplie,
    removeSupplie,
    searchSupplies,
  };
};
