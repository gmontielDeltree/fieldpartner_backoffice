import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { Country } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useCountry = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [country, setCountry] = useState<Country[]>([]);


    const createCountry = async (newCountry: Country) => {
        setIsLoading(true);
        try {
            const response = await dbContext.countries.post(newCountry);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Pais', 'Nuevo Pais agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/country');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getCountry = async () => {
        setIsLoading(true);
        try {
            const response = await dbContext.countries.allDocs({ include_docs: true });

            setIsLoading(false);

            if (response.rows.length) {
                const documents: Country[] = response.rows.map(row => row.doc as Country);
                setCountry(documents);
            }
            else
            setCountry([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron paises.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateCountry = async (updateCountry: Country) => {
        setIsLoading(true);

        try {
            const response = await dbContext.countries.put(updateCountry);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Pais', 'Actualizado.', 'success');

            navigate('/country');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron paises.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeCountry = async (countryId: string, revCountry: string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.countries.remove(countryId, revCountry);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Pais', 'Eliminado.', 'success');

            navigate('/country');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron paises.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }



    return {
        //* Propiedades
        error,
        isLoading,
        country,

        //* Métodos
        createCountry,
        getCountry,
        setCountry,
        updateCountry,
        removeCountry
    }
}