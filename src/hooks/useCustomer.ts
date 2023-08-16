import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useState } from "react"
import { Customer } from "../types";
import { backofficeApi } from "../config";

const controller = 'customer';

export const useCustomer = () => {

    const navigate = useNavigate();
    const [status, setStatus] = useState<number>();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);


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

            navigate('/list-customer');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.get<Customer[]>(`/${controller}`);

            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok)
                setCustomers(response.data);
            else
                setCustomers([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No hay registro de clientes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateCustomer = async (idCustomer: string, updateCustomer: Customer) => {
        setIsLoading(true);

        try {
            const response = await backofficeApi.patch(`/${controller}/${idCustomer}`, updateCustomer);
            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok)
                Swal.fire('Cliente', 'Cliente actualizado.', 'success');

            navigate('/list-customer');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No hay registro de clientes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }


    return {
        //* Propiedades
        status,
        error,
        isLoading,
        customers,

        //* Métodos
        createCustomer,
        getCustomers,
        setCustomers,
        updateCustomer
    }
}