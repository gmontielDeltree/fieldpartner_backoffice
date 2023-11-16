import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Movement } from "../types";
import { dbContext} from "../services/pouchdbService";

export const useMovements = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [conceptoError, setConceptoError] = useState(false);

  const createMovement = async (newMovement: Movement) => {
    setIsLoading(true);

    if (!newMovement.name.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await dbContext.movements.post(newMovement);

      setIsLoading(false);
      if (response.ok)
        Swal.fire('Movimiento', 'Nuevo Movimiento agregado.', 'success');
      else
        Swal.fire('Movimiento', 'Verificar campos obligatorios.', 'error');

      navigate('/type-movement');
    } catch (error) {
      console.log(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const getMovements = async () => {
    setIsLoading(true);
    try {
      const response = await dbContext.movements.allDocs({ include_docs: true });

      setIsLoading(false);

      if (response.rows.length) {
        const documents: Movement[] = response.rows.map(row => row.doc as Movement);
        setMovements(documents);
      }
      else
        setMovements([]);

    } catch (error) {
      console.log(error)
      Swal.fire('Error', 'No se encontraron movimientos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  }

  const updateMovement = async (updateMovement: Movement) => {
    setIsLoading(true);

    if (!updateMovement.name.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await dbContext.movements.put(updateMovement);
      setIsLoading(false);

      if (response.ok)
        Swal.fire('Movimiento', 'Actualizado.', 'success');

      navigate('/type-movement');
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'No se encontraron movimientos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const removeMovement = async (movementId: string, revMovement: string) => {

    try {
      const response = await dbContext.movements.remove(movementId, revMovement);
      setIsLoading(false);

      if (response.ok)
        Swal.fire('Movimiento', 'Eliminado.', 'success');

      navigate('/type-movement');
    } catch (error) {
      console.log(error)
      Swal.fire('Error', 'No se encontraron movimientos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  }

  const searchMovements = async (searchTerm: string) => {
    setIsLoading(true);
  
    try {
      const response = await dbContext.movements.query('concept-search-view', {
        startkey: searchTerm,
        endkey: searchTerm + '\uffff',
        include_docs: true,
      });
  
      setIsLoading(false);
  
      if (response.rows.length) {
        const searchResults: Movement[] = response.rows.map(row => row.doc as Movement);
        setMovements(searchResults);
      } else {
        setMovements([]);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error durante la búsqueda.', 'error');
      setIsLoading(false);
      if (error) setError(error);
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
    }
}

