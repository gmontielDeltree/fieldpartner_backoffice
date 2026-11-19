import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Licences, EnumLicenceType } from '../types';
import { backofficeApi } from '../config';
import { SystemResponse } from './useSystem';

/** label del back ('C'/'L'/'H') ↔ rótulo ES de la UI (Campo/Licencia/Hectárea). */
const LABEL_TO_TYPE: Record<string, string> = {
  C: EnumLicenceType.C,
  L: EnumLicenceType.L,
  H: EnumLicenceType.H,
};

const TYPE_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(LABEL_TO_TYPE).map(([label, type]) => [type, label]),
);

/** Shape del LicenceTypeDto que devuelve el back en /licence-types. */
interface LicenceTypeResponse {
  id: string;
  label: string;
  description: string | null;
  system: Omit<SystemResponse, 'technicalDetails'> | null;
  maximumUnitAllowed: number | null;
  allowedUsersCount: number | null;
}

const fromResponse = (item: LicenceTypeResponse): Licences => ({
  id: item.id,
  description: item.description ?? '',
  licenceType: LABEL_TO_TYPE[item.label] ?? item.label,
  systemId: item.system?.id ?? null,
  systemType: item.system?.name ?? '',
  maximumUnitAllowed: item.maximumUnitAllowed ?? 0,
  allowedUsersCount: item.allowedUsersCount ?? 0,
});

const toPayload = (licence: Licences) => ({
  label: TYPE_TO_LABEL[licence.licenceType] ?? licence.licenceType,
  description: licence.description,
  systemId: licence.systemId || null,
  maximumUnitAllowed: licence.maximumUnitAllowed,
  allowedUsersCount: licence.allowedUsersCount,
});

export const useLicences = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [licences, setLicences] = useState<Licences[]>([]);

  const getLicences = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<LicenceTypeResponse[]>('/licence-types');
      setLicences(response.data.map(fromResponse));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar las licencias.', 'error');
      setLicences([]);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLicences = async (newLicences: Licences) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/licence-types', toPayload(newLicences));
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Licencia', 'Nueva licencia creada correctamente.', 'success');
        navigate('/licences');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error inesperado al crear la licencia.', 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLicences = async (updatedLicences: Licences) => {
    const id = updatedLicences.id;
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/licence-types/${id}`, toPayload(updatedLicences));
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Licencia', 'Licencia actualizada correctamente.', 'success');
        navigate('/licences');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Ocurrió un error al actualizar la licencia.', 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeLicences = async (licencesId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/licence-types/${licencesId}`);
      Swal.fire('Licencia', 'Licencia eliminada correctamente.', 'success');
      getLicences();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar: puede tener licencias de cuentas asociadas.', 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    licences,

    //* Métodos
    createLicences,
    getLicences,
    setLicences,
    updateLicences,
    removeLicences,
  };
};
