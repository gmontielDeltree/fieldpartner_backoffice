import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backofficeApi } from '../config';
import { clearErrorMessage, finishLoading, onChecking, onLogin, onLogout, startLoading } from '../store';
import { useAppSelector } from './useRedux';
// import { UserLogin } from '@types';
import {
    HttpStatusCode,
    isAxiosError
} from 'axios';
import { AuthChallenge, ResponseAuthLogin, ResponseAuthRenew, User, UserLogin, UserRegister } from '../types';


export interface ErrorResponseAuth {
    code: "UserNotConfirmedException" | "NotAuthorizedException" | "UsernameExistsException";
    message: string;
}

const controller = 'auth';

export const useAuthStore = () => {

    const {
        status,
        user,
        errorMessage,
        isLoading } = useAppSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const startLogin = async ({ email, password }: UserLogin) => {
        // dispatch(onChecking());
        dispatch(startLoading());
        try {
            const response = await backofficeApi.post<ResponseAuthLogin | AuthChallenge>(
                `/${controller}/login`, {
                email, password
            });

            if ('challengeName' in response.data) {
                localStorage.setItem('challenge_bo', JSON.stringify(response.data));
                dispatch(onLogout('Debe cambiar su contraseña al ingresar por primera vez.'));
                dispatch(finishLoading());
                navigate('/auth/complete-new-password');
                return;
            }

            const { auth, user } = response.data;
            const { accessToken, refreshToken, expiresIn } = auth;
            localStorage.setItem('t_bo', accessToken);
            localStorage.setItem('r_bo', refreshToken);
            localStorage.setItem('t_exp_bo', (new Date().getTime() + expiresIn * 1000).toString());
            localStorage.setItem('user_session_bo', JSON.stringify(user));
            dispatch(onLogin(user));
            dispatch(finishLoading());
            dispatch(clearErrorMessage());

        } catch (error) {
            // 401 = credenciales inválidas. Otros rechazos (p. ej. 403 por canal/rol: el BO es
            // solo para GENERAL_ADMIN) traen un mensaje del back que conviene mostrar tal cual.
            const backMessage = isAxiosError(error) && error.response?.status !== HttpStatusCode.Unauthorized
                ? (error.response?.data as { message?: string } | undefined)?.message
                : undefined;
            dispatch(onLogout(backMessage || 'Incorrect username or password.'));
            dispatch(finishLoading());
        }
    }

    const startRegister = async ({ email, password, name }: UserRegister) => {
        // dispatch(onChecking());
        dispatch(startLoading());
        try {
            const response = await backofficeApi.post(`/${controller}/register`, {
                email, password, name
            });
            if (response.status === HttpStatusCode.Created) {
                //Seteamos el email del usuario
                localStorage.setItem('username_temp', email);
                //Luego redireccionamos a pagina de confirmar email
                dispatch(onLogout('Confirm account.'));
                navigate('/init/auth/confirm');
                return dispatch(finishLoading());
            }

        } catch (error) {
            if (isAxiosError<ErrorResponseAuth>(error) && error.response?.data) {
                const { code, message } = error.response.data;

                if (code === "UsernameExistsException")
                    dispatch(onLogout(message));
                else
                    dispatch(onLogout(message[1]));
            }
            dispatch(finishLoading());
        }
    }

    const startConfirm = async (confirmationCode: string) => {
        dispatch(startLoading());
        try {
            const email = localStorage.getItem('username_temp');
            if (!email) return dispatch(onLogout(""));

            const response = await backofficeApi.post(`/${controller}/confirm`, {
                email, confirmationCode
            });

            if (response.status === HttpStatusCode.Created) {
                localStorage.removeItem('username_temp');
                dispatch(onLogout(""));
                navigate('/init/auth/login');
                return dispatch(finishLoading());
            }

        } catch (error) {
            dispatch(onLogout('Por favor volve a intentar en unos minutos.'));
            dispatch(clearErrorMessage());
            localStorage.removeItem('username_temp');
            dispatch(finishLoading());
        }
    }

    //    const checkAuthToken = async () => {

    //     dispatch(onChecking())
    //     try {


    //         localStorage.setItem('accessToken',"" );
    //         localStorage.setItem('token_expiration',"" );

    //         dispatch(onLogin({
    //             isAdmin: true, firstName: "Rodrigo", accountId: "123", id: "123",
    //             lastName: 'Garro',
    //             username: 'Rodrigo',
    //             countryId: 'AR'
    //         }));

    //     } catch (error) {
    //         localStorage.clear();
    //         dispatch(onLogout(""));
    //     }
    // }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('t_bo');
        const refreshToken = localStorage.getItem('r_bo');
        const userSession = localStorage.getItem("user_session_bo");

        if (!token || !refreshToken || !userSession) return dispatch(onLogout(""));

        dispatch(onChecking());
        try {
            // const { data } = await authApi.get('auth/renew');
            const expiration = localStorage.getItem("t_exp_bo");
            if (new Date().getTime() > Number(expiration)) {
                dispatch(onLogout(""));
                return;
            }
            const lastPath = localStorage.getItem("lastPath_bo") || "/";
            navigate(lastPath, { replace: true });
            const userLogin = JSON.parse(userSession || "") as User;
            dispatch(onLogin(userLogin));

            const response = await backofficeApi.post<ResponseAuthRenew>(
                `/${controller}/refresh`, { refreshToken });

            if (response.status === HttpStatusCode.Created) {
                localStorage.setItem('t_bo', response.data.accessToken);
                localStorage.setItem('r_bo', response.data.refreshToken);
                localStorage.setItem('t_exp_bo', (new Date().getTime() + response.data.expiresIn * 1000).toString());
            }

        } catch (error) {
            localStorage.clear();
            dispatch(onLogout(""));
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout(""));
    }


    return {
        //* Propiedades
        errorMessage,
        status,
        user,
        isLoading,

        //* Métodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
        startConfirm
    }

}