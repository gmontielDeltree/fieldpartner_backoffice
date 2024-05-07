import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { Licences } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useLicences = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [licences, setLicences] = useState<Licences[]>([]);


    const createLicences = async (newLicences: Licences) => {
        setIsLoading(true);
        try {
            const response = await dbContext.licences.post(newLicences);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Licences', 'Nueva Licences agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/licences');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getLicences = async () => {
        setIsLoading(true);
        try {
            const response = await dbContext.licences.allDocs({ include_docs: true });

            setIsLoading(false);

            if (response.rows.length) {
                const documents: Licences[] = response.rows.map(row => row.doc as Licences);
                setLicences(documents);
            }
            else
            setLicences([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron licences.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateLicences = async (updateLicences: Licences) => {
        setIsLoading(true);

        try {
            const response = await dbContext.licences.put(updateLicences);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Licences', 'Actualizado.', 'success');

            navigate('/licences');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron licenes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeLicences = async (licencesId: string, revLicences: string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.licences.remove(licencesId, revLicences);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Licences', 'Eliminado.', 'success');

            navigate('/licences');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron licenes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
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