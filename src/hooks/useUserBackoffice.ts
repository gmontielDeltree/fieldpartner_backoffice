import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useState } from "react";
import { AccountUsersResponse, CreateUserPayload, SystemUser, UserDto } from "../types";
import { backofficeApi } from "../config";

const controller = "users";

export const useUser = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<SystemUser[]>([]);

    const getUsers = async () => {
        setIsLoading(true);

        try {
            // El back responde los usuarios agrupados por cuenta; los aplanamos a una
            // lista de usuarios del sistema (con su cuenta) para la tabla.
            const response = await backofficeApi.get<AccountUsersResponse[]>(`/${controller}`);

            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok) {
                const flat: SystemUser[] = response.data.flatMap((group) =>
                    group.users.map((u) => ({
                        id: u.id,
                        username: u.username,
                        email: u.email,
                        role: u.role,
                        state: u.state,
                        accountId: group.account.id,
                        accountDenomination: group.account.denomination,
                        accountCategory: group.account.category,
                    }))
                );
                setUsers(flat);
            } else {
                setUsers([]);
            }

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No hay registro de usuarios.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const createUser = async (payload: CreateUserPayload) => {
        setIsLoading(true);
        try {
            // Solo los campos que el back acepta (forbidNonWhitelisted rechaza extras como isAdmin/_id).
            const response = await backofficeApi.post(`/${controller}`, payload);

            setIsLoading(false);

            if (response.status === HttpStatusCode.Created) {
                Swal.fire('Usuario', 'Nuevo usuario agregado.', 'success');
                navigate('/list-user');
            } else {
                Swal.fire('Usuario', 'Verificar campos obligatorios.', 'error');
            }

        } catch (error: any) {
            console.log(error)
            const message = error?.response?.data?.message || 'Ocurrió un error inesperado';
            Swal.fire('Ups', Array.isArray(message) ? message.join(' · ') : message, 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateUser = async (idUser: string, updateUser: UserDto) => {
        setIsLoading(true);

        try {
            const response = await backofficeApi.patch(`/${controller}/${idUser}`, {
                username: updateUser.username,
                email: updateUser.email,
                previousPassword: updateUser.previousPassword,
                newPassword: updateUser.newPassword
            });
            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok)
                Swal.fire('Usuario', 'Usuario actualizado.', 'success');

            navigate('/list-user');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'Usuario no encontrado.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    return {
        //* Propiedades
        error,
        isLoading,
        users,

        //* Métodos
        createUser,
        getUsers,
        setUsers,
        updateUser
    }
}