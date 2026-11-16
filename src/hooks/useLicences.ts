import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { Licences, EnumLicenceType } from "../types";
import { dbContext } from "../services/pouchdbService";
import { backofficeApi } from "../config";

const LABEL_TO_TYPE: Record<string, string> = {
  C: EnumLicenceType.C,
  L: EnumLicenceType.L,
  H: EnumLicenceType.H,
};


export const useLicences = () => {

    const navigate = useNavigate();
    const [error, setError] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [licences, setLicences] = useState<Licences[]>([]);


    const createLicences = async (newLicences: Licences) => {
        setIsLoading(true);
        try {
            const response = await dbContext.licences.post(newLicences);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Licencia', 'Nueva licencia creada correctamente.', 'success');
            else
                Swal.fire('Licencia', 'Verificar campos obligatorios.', 'error');

            navigate('/licences');
        } catch (error) {
            Swal.fire('Error', 'Ocurrió un error inesperado al crear la licencia.', 'error');
            setIsLoading(false);
            setError(error);
        }
    }

    const getLicences = async () => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.get<any[]>('/licence-types');
            const documents: Licences[] = response.data.map(item => ({
                _id: item.id,
                id: item.id,
                description: item.description ?? '',
                licenceType: LABEL_TO_TYPE[item.label] ?? item.label,
                systemType: item.systemType ?? '',
                maximumUnitAllowed: item.maximumUnitAllowed ?? 0,
                allowedUsersCount: item.allowedUsersCount ?? 0,
            }));
            setLicences(documents);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las licencias.', 'error');
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateLicences = async (updateLicences: Licences) => {
        setIsLoading(true);

        try {
            const response = await dbContext.licences.put(updateLicences);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Licencia', 'Licencia actualizada correctamente.', 'success');

            navigate('/licences');
        } catch (error) {
            Swal.fire('Error', 'Ocurrió un error al actualizar la licencia.', 'error');
            setIsLoading(false);
            setError(error);
        }
    }

    const removeLicences = async (licencesId: string, revLicences: string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.licences.remove(licencesId, revLicences);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Licencia', 'Licencia eliminada correctamente.', 'success');

            navigate('/licences');
        } catch (error) {
            Swal.fire('Error', 'Ocurrió un error al eliminar la licencia.', 'error');
            setIsLoading(false);
            setError(error);
        }
    }



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
        removeLicences
    };
};