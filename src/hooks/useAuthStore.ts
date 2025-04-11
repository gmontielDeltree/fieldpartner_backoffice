import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backofficeApi } from '../config';
import { clearErrorMessage, finishLoading, onChecking, onLogin, onLogout, startLoading } from '../store';
import { useAppSelector } from './useRedux';
// import { UserLogin } from '@types';
import {
    AxiosError,
    HttpStatusCode
} from 'axios';
import { ResponseAuthLogin, ResponseAuthRenew, User, UserLogin, UserRegister } from '../types';
import { convertTimestampToDate } from '../helpers/dates';


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
            const response = await backofficeApi.post<ResponseAuthLogin>(
                `/${controller}/login`, {
                email, password
            });

            if (response.data) {
                const { auth, user } = response.data;
                const { accessToken, refreshToken, expiration } = auth;
                localStorage.setItem('t_bo', accessToken);
                localStorage.setItem('r_bo', refreshToken);
                localStorage.setItem('t_exp_bo', convertTimestampToDate(expiration).getTime().toString());
                localStorage.setItem("user_session_bo", JSON.stringify(user));
                dispatch(onLogin(user));
            }
            dispatch(finishLoading());
            dispatch(clearErrorMessage());

        } catch (error) {
            dispatch(onLogout('Incorrect username or password.'));
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

        } catch (error: AxiosError<ErrorResponseAuth> | any) {
            if (error.response && error.response.data) {
                const responseError: ErrorResponseAuth = error.response.data;
                const code = responseError.code;
                const message = responseError.message;

                if (code === "UsernameExistsException")
                    dispatch(onLogout(message));
                else
                    dispatch(onLogout(error.response.data.message[1]));
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
                `/${controller}/renew`, { refreshToken });

            if (response.status === HttpStatusCode.Created) {
                const expiresIn = new Date().getTime() + response.data.ExpiresIn * 1000;
                localStorage.setItem('t_bo', response.data.accessToken);
                // localStorage.setItem('r_bo', response.data.refreshToken);
                localStorage.setItem('t_exp_bo', expiresIn.toString());
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