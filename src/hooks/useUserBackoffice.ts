import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useState } from "react";
import { UserDto } from "../types";
import { backofficeApi } from "../config";

const controller = "user-licence";

export const useUser = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserDto[]>([]);

    const getUsers = async () => {
        setIsLoading(true);

        try {
            const response = await backofficeApi.get<UserDto[]>(`/${controller}`);

            setIsLoading(false);

            if (response.status === HttpStatusCode.Ok)
                setUsers(response.data);
            else
                setUsers([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No hay registro de usuarios.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const createUser = async (newUser: UserDto) => {
        setIsLoading(true);
        try {
            const response = await backofficeApi.post(`/${controller}`, newUser);

            setIsLoading(false);

            if (response.status === HttpStatusCode.Created)
                Swal.fire('Usuario', 'Nuevo usuario agregado.', 'success');
            else
                Swal.fire('Usuario', 'Verificar campos obligatorios.', 'error');

        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
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