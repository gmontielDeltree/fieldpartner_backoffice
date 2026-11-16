import { HttpStatusCode, isAxiosError } from "axios";
// import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useState } from "react"
import { Account, AccountDto, UpdateAccount } from "../interfaces/account";
import { backofficeApi } from "../config";
// import { UserDto } from "../types";

const urlAccount = 'accounts';
const urlUserLicence = 'users';

export const useAccount = () => {

    // const navigate = useNavigate();
    const [status, setStatus] = useState<number>();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<AccountDto[]>([]);


    const createAccount = async (newAccount: Account) => {
        setIsLoading(true);
        try {
            const isCategoryA = newAccount.category === 'A';

            const payload: Record<string, unknown> = {
                category: newAccount.category,
                denomination: newAccount.denomination,
                countryCode: newAccount.country,
                status: newAccount.status || undefined,
                licenceNumber: isCategoryA ? (newAccount.licenceNumber || undefined) : undefined,
                isLicenceMultipleCountry: newAccount.isLicenceMultipleCountry,
                maxHectares: !isCategoryA ? Number(newAccount.maxHectares) : undefined,
                licence: {
                    licenceTypeId: newAccount.licence,
                    startDate: newAccount.startDateLicence,
                    endDate: newAccount.endDateLicence,
                    activeUsersAllowed: Number(newAccount.activeUsersAllowed),
                    amountLicencesAllowed: Number(newAccount.amountLicencesAllowed) || undefined,
                },
                user: {
                    email: newAccount.user?.email,
                    username: newAccount.user?.username,
                    password: newAccount.user?.password,
                    language: newAccount.userLanguage || 'es',
                },
            };

            if (isCategoryA) {
                payload.company = {
                    fantasyName: newAccount.fantasyName,
                    socialReason: newAccount.socialReason,
                    tributaryCode: newAccount.trybutaryCode,
                    address: newAccount.address,
                    phone: newAccount.phone,
                    email: newAccount.companyEmail,
                    locality: newAccount.locality || undefined,
                    province: newAccount.province || undefined,
                    zipCode: newAccount.zipCode || undefined,
                    website: newAccount.website || undefined,
                    observation: newAccount.observation || undefined,
                    secondaryContact: newAccount.secondaryContact || undefined,
                    companyLogo: newAccount.companyLogo || undefined,
                };
            }

            const response = await backofficeApi.post(`/${urlAccount}`, payload);

            setStatus(response.status);
            if (response.status === HttpStatusCode.Created) {
                Swal.fire('Cliente', 'Nuevo cliente agregado.', 'success');
                return true;
            } else {
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');
                return false;
            }
        } catch (error) {
            console.error(error);
            const message = (isAxiosError(error) && error.response?.data?.message)
                || 'Ocurrió un error inesperado';
            Swal.fire('Ups', message, 'error');
            if (error) setError(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    const getAccounts = async () => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.get<AccountDto[]>(`/${urlAccount}`);

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

    const getUserByEmail = async (email: string) => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.get(`/${urlUserLicence}/email/${email}`);
            return response.data;

        } catch (error) {
            console.error(error)
            if (error) setError(error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const checkEmailInCognito = async (email: string): Promise<boolean> => {
        try {
            const response = await backofficeApi.post('/auth/check-email', { email });
            return response.data?.exists ?? false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    const updateAccount = async (accountId: string, updateAccount: UpdateAccount) => {
        setIsLoading(true);

        try {
            const response = await backofficeApi.patch(`/${urlAccount}/${accountId}`, updateAccount);
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
        updateAccount,
        getUserByEmail,
        checkEmailInCognito
    }
}