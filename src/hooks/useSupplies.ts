import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { SupplyType } from "../types";
import { dbContext} from "../services/pouchdbService";

export const useSupplies = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [supplies, setSupplies] = useState<SupplyType[]>([]);
  const [conceptoError, setConceptoError] = useState(false);

  const createSupplies = async (newSupplie: SupplyType) => {
    setIsLoading(true);

    if (!newSupplie.name.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await dbContext.supply_type.post(newSupplie);

      setIsLoading(false);
      if (response.ok)
        Swal.fire('Insumo', 'Nuevo Insumo agregado.', 'success');
      else
        Swal.fire('Insumo', 'Verificar campos obligatorios.', 'error');

      navigate('/type-supplies');
    } catch (error) {
      console.log(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const getSupplies = async () => {
    setIsLoading(true);
    try {
      const response = await dbContext.supply_type.allDocs({ include_docs: true });

      setIsLoading(false);

      if (response.rows.length) {
        const documents: SupplyType[] = response.rows.map(row => row.doc as SupplyType);
        setSupplies(documents);
      }
      else
        setSupplies([]);

    } catch (error) {
      console.log(error)
      Swal.fire('Error', 'No se encontraron movimientos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  }

  const updateSupplie = async (updateSupplie: SupplyType) => {
    setIsLoading(true);

    if (!updateSupplie.name.trim()) {
      setConceptoError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await dbContext.supply_type.put(updateSupplie);
      setIsLoading(false);

      if (response.ok)
        Swal.fire('Insumo', 'Actualizado.', 'success');

      navigate('/type-supplies');
    } catch (error) {
      console.log(error);
      Swal.fire('Error', 'No se encontraron Insumos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  };

  const removeSupplie = async (supplieId: string, removeSupplie: string) => {

    try {
      const response = await dbContext.supply_type.remove(supplieId, removeSupplie);
      setIsLoading(false);

      if (response.ok)
        Swal.fire('Insumo', 'Eliminado.', 'success');

      navigate('/type-supplies');
    } catch (error) {
      console.log(error)
      Swal.fire('Error', 'No se encontraron insumos.', 'error');
      setIsLoading(false);
      if (error) setError(error);
    }
  } 

  const searchSupplies = async (searchTerm: string) => {
    setIsLoading(true);
  
    try {
      const response = await dbContext.supply_type.query('supplies-search-view', {
        startkey: searchTerm,
        endkey: searchTerm + '\uffff',
        include_docs: true,
      });
  
      setIsLoading(false);
  
      if (response.rows.length) {
        const searchResults: SupplyType[] = response.rows.map(row => row.doc as SupplyType);
        setSupplies(searchResults);
      } else {
        setSupplies([]);
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
        supplies,
        conceptoError, 

        //* Métodos
        createSupplies, 
        getSupplies, 
        setSupplies,
        updateSupplie, 
        removeSupplie,
        searchSupplies,
    }
}

