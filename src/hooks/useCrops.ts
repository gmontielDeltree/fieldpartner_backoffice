import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { Crops } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useCrops = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [crops, setCrops] = useState<Crops[]>([]);


    const createCrops = async (newCrops: Crops) => {
        setIsLoading(true);
        try {
            const response = await dbContext.crops.post(newCrops);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Cultivo', 'Nuevo Cultivo agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/crops');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getCrops = async () => {
        setIsLoading(true);
        try {
            const response = await dbContext.crops.allDocs({ include_docs: true });

            setIsLoading(false);

            if (response.rows.length) {
                const documents: Crops[] = response.rows.map(row => row.doc as Crops);
                setCrops(documents);
            }
            else
                setCrops([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron cultivos.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateCrops = async (updateCrops: Crops) => {
        setIsLoading(true);

        try {
            const response = await dbContext.crops.put(updateCrops);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Cultivo', 'Actualizado.', 'success');

            navigate('/crops');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron cultivos.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeCrops = async (cropsyId: string, revCrops: string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.crops.remove(cropsyId, revCrops);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Cultivo', 'Eliminado.', 'success');

            navigate('/crops');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron cultivos.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }



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
        removeCrops
    }
}