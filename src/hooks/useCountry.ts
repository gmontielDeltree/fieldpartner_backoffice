import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Country } from '../types';
import { backofficeApi } from '../config';

export const useCountry = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState<Country[]>([]);

  const getCountry = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<Country[]>('/countries');
      setCountry(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se encontraron países.', 'error');
      setCountry([]);
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCountry = async (newCountry: Country) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/countries', {
        code: newCountry.code,
        descriptionES: newCountry.descriptionES,
        descriptionPT: newCountry.descriptionPT,
        descriptionEN: newCountry.descriptionEN,
        language: newCountry.language,
        currency: newCountry.currency,
        taxKey: newCountry.taxKey,
        taxKeyFormat: newCountry.taxKeyFormat,
      });
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('País', 'Nuevo país agregado.', 'success');
        navigate('/country');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCountry = async (updatedCountry: Country) => {
    const id = updatedCountry.id || updatedCountry._id;
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/countries/${id}`, {
        descriptionES: updatedCountry.descriptionES,
        descriptionPT: updatedCountry.descriptionPT,
        descriptionEN: updatedCountry.descriptionEN,
        language: updatedCountry.language,
        currency: updatedCountry.currency,
        taxKey: updatedCountry.taxKey,
        taxKeyFormat: updatedCountry.taxKeyFormat,
      });
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('País', 'Actualizado.', 'success');
        navigate('/country');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el país.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCountry = async (countryId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/countries/${countryId}`);
      Swal.fire('País', 'Eliminado.', 'success');
      getCountry();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar el país.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    country,
    createCountry,
    getCountry,
    setCountry,
    updateCountry,
    removeCountry,
  };
};
