import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TypeDevices } from '../types';
import { backofficeApi } from '../config';

/** El back devuelve description/family/subFamily como null cuando no se cargaron. */
const normalizeTypeDevice = (typeDevice: TypeDevices): TypeDevices => ({
  ...typeDevice,
  description: typeDevice.description ?? '',
  family: typeDevice.family ?? '',
  subFamily: typeDevice.subFamily ?? '',
});

const toPayload = (typeDevice: TypeDevices) => ({
  model: typeDevice.model,
  description: typeDevice.description,
  family: typeDevice.family,
  subFamily: typeDevice.subFamily,
  available: typeDevice.available,
});

export const useTypeDevices = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [typeDevices, setTypeDevices] = useState<TypeDevices[]>([]);

  const getTypeDevices = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<TypeDevices[]>('/type-devices');
      setTypeDevices(response.data.map(normalizeTypeDevice));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se encontraron dispositivos.', 'error');
      setTypeDevices([]);
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTypeDevices = async (newTypeDevices: TypeDevices) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/type-devices', toPayload(newTypeDevices));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Tipo Dispositivo', 'Nuevo Tipo de Dispositivo agregado.', 'success');
        navigate('/type-of-devices');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTypeDevices = async (updatedTypeDevices: TypeDevices) => {
    const id = updatedTypeDevices.id;
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/type-devices/${id}`, toPayload(updatedTypeDevices));
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Tipos Dispositivo', 'Actualizado.', 'success');
        navigate('/type-of-devices');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el tipo de dispositivo.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeTypeDevices = async (typeDevicesId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/type-devices/${typeDevicesId}`);
      Swal.fire('Tipos Dispositivo', 'Eliminado.', 'success');
      getTypeDevices();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar el tipo de dispositivo.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    typeDevices,

    //* Métodos
    createTypeDevices,
    getTypeDevices,
    setTypeDevices,
    updateTypeDevices,
    removeTypeDevices,
  };
};
