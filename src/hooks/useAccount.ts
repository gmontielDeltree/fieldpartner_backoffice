import { HttpStatusCode } from "axios";
// import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useState } from "react"
import { Account, UpdateAccount } from "../interfaces/account";
import { backofficeApi } from "../config";

const controller = 'account';

export const useAccount = () => {

    // const navigate = useNavigate();
    const [status, setStatus] = useState<number>();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);


    const createAccount = async (newAccount: Account) => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.post(`/${controller}`, {
                ...newAccount,
                amountLicencesAllowed: Number(newAccount.amountLicencesAllowed)
            });

            setIsLoading(false);
            setStatus(response.status);
            if (response.status === HttpStatusCode.Created) {
                Swal.fire('Cliente', 'Nuevo cliente agregado.', 'success');
                return true;
            }
            else {
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');
                return false
            }


        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
            return false;
        }
    }

    const getAccounts = async () => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.get<Account[]>(`/${controller}`);

            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok)
                setAccounts(response.data);
            else
                setAccounts([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No hay registro de clientes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateAccount = async (accountId: string, updateAccount: UpdateAccount) => {
        setIsLoading(true);

        try {
            const response = await backofficeApi.patch(`/${controller}/${accountId}`, updateAccount);
            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok) {
                Swal.fire('Cliente', 'Cliente actualizado.', 'success');
                return true;
            }
            else
                return false;

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No hay registro de clientes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
            return false;
        }
    }


    return {
        //* Propiedades
        status,
        error,
        isLoading,
        accounts,

        //* Métodos
        createAccount,
        getAccounts,
        setAccounts,
        updateAccount
    }
}