import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Movement } from '../types';
import { backofficeApi } from '../config';

/** El back devuelve concept PT/EN, description y typeMovement como null cuando no se cargaron. */
const normalizeMovement = (movement: Movement): Movement => ({
  ...movement,
  conceptPT: movement.conceptPT ?? '',
  conceptEN: movement.conceptEN ?? '',
  description: movement.description ?? '',
  typeMovement: movement.typeMovement ?? '',
});

const toPayload = (movement: Movement) => ({
  name: movement.name,
  conceptES: movement.conceptES || movement.name,
  conceptPT: movement.conceptPT,
  conceptEN: movement.conceptEN,
  description: movement.description,
  typeMovement: movement.typeMovement,
  manual: movement.manual,
  stockSum: movement.stockSum,
});

export const useMovements = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [conceptoError, setConceptoError] = useState(false);

  const getMovements = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<Movement[]>('/movement-types');
      setMovements(response.data.map(normalizeMovement));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se encontraron movimientos.', 'error');
      setMovements([]);
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMovement = async (newMovement: Movement) => {
    setIsLoading(true);

    if (!newMovement.name.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await backofficeApi.post('/movement-types', toPayload(newMovement));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Movimiento', 'Nuevo Movimiento agregado.', 'success');
        navigate('/type-movement');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMovement = async (updatedMovement: Movement) => {
    const id = updatedMovement.id;
    if (!id) return;
    setIsLoading(true);

    if (!updatedMovement.name.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await backofficeApi.patch(`/movement-types/${id}`, toPayload(updatedMovement));
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Movimiento', 'Actualizado.', 'success');
        navigate('/type-movement');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el movimiento.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeMovement = async (movementId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/movement-types/${movementId}`);
      Swal.fire('Movimiento', 'Eliminado.', 'success');
      getMovements();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar el movimiento.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /** Sin endpoint de búsqueda en el back: trae todo y filtra por nombre/conceptos. */
  const searchMovements = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<Movement[]>('/movement-types');
      const term = searchTerm.toLowerCase();
      const searchResults = response.data
        .map(normalizeMovement)
        .filter(movement =>
          [movement.name, movement.conceptES, movement.conceptPT, movement.conceptEN, movement.description]
            .some(field => (field ?? '').toLowerCase().includes(term)),
        );
      setMovements(searchResults);
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
    movements,
    conceptoError,

    //* Métodos
    createMovement,
    getMovements,
    setMovements,
    updateMovement,
    removeMovement,
    searchMovements,
  };
};
