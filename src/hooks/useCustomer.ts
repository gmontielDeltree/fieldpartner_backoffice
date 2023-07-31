import { useState } from "react"
import { Customer } from "../types";
import Swal from 'sweetalert2';
import { backofficeApi } from "../config";
import { HttpStatusCode } from "axios";

const controller = 'customer';

export const useCustomer = () => {

    const [status, setStatus] = useState<number>();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const createCustomer = async (newCustomer: Customer) => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.post(`/${controller}`, newCustomer);

            setIsLoading(false);
            setStatus(response.status);
            if (response.status === HttpStatusCode.Created)
                Swal.fire('Cliente', 'Nuevo cliente agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }


    return {
        //* Propiedades
        status,
        error,
        isLoading,

        //* Métodos
        createCustomer
    }
}