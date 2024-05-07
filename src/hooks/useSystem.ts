import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { System } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useSystem = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [system, setSystem] = useState<System[]>([]);


    const createSystem = async (newSystem: System) => {
        setIsLoading(true);
        try {
            const response = await dbContext.system.post(newSystem);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('System', 'Nuevo System agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/system');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getSystem = async () => {
        setIsLoading(true);
        try {
            const response = await dbContext.system.allDocs({ include_docs: true });

            setIsLoading(false);

            if (response.rows.length) {
                const documents: System[] = response.rows.map(row => row.doc as System);
                setSystem(documents);
            }
            else
            setSystem([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron system.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateSystem = async (updateSystem: System) => {
        setIsLoading(true);

        try {
            const response = await dbContext.system.put(updateSystem);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('System', 'Actualizado.', 'success');

            navigate('/system');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron system.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeSystem = async (systemId: string, revSystem: string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.system.remove(systemId, revSystem);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('System', 'Eliminado.', 'success');

            navigate('/system');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron system.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }



    return {
        //* Propiedades
        error,
        isLoading,
        system,

        //* Métodos
        createSystem,
        getSystem,
        setSystem,
        updateSystem,
        removeSystem
    }
}