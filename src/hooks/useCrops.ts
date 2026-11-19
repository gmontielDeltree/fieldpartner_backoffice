import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Crops } from '../types';
import { backofficeApi } from '../config';

/** El back devuelve PT/EN/variety como null cuando no se cargaron; la UI espera strings. */
const normalizeCrop = (crop: Crops): Crops => ({
  ...crop,
  descriptionPT: crop.descriptionPT ?? '',
  descriptionEN: crop.descriptionEN ?? '',
  variety: crop.variety ?? '',
});

const toPayload = (crop: Crops) => ({
  descriptionES: crop.descriptionES,
  descriptionPT: crop.descriptionPT,
  descriptionEN: crop.descriptionEN,
  cropType: crop.cropType,
  variety: crop.variety,
  prepared: crop.prepared,
  sowing: crop.sowing,
  application: crop.application,
  germination: crop.germination,
  harvest: crop.harvest,
});

export const useCrops = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [crops, setCrops] = useState<Crops[]>([]);

  const getCrops = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<Crops[]>('/crops');
      setCrops(response.data.map(normalizeCrop));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se encontraron cultivos.', 'error');
      setCrops([]);
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCrops = async (newCrops: Crops) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/crops', toPayload(newCrops));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Cultivo', 'Nuevo Cultivo agregado.', 'success');
        navigate('/crops');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCrops = async (updatedCrops: Crops) => {
    const id = updatedCrops.id;
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/crops/${id}`, toPayload(updatedCrops));
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Cultivo', 'Actualizado.', 'success');
        navigate('/crops');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el cultivo.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCrops = async (cropsId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/crops/${cropsId}`);
      Swal.fire('Cultivo', 'Eliminado.', 'success');
      getCrops();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar el cultivo.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    crops,

    //* Métodos
    createCrops,
    getCrops,
    setCrops,
    updateCrops,
    removeCrops,
  };
};
