import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    // Legacy actions
    // clearErrorMessage,
    // finishLoading,
    // onChecking,
    // onLogin,
    // onLogout,
    // startLoading,
    // Nuevas actions en español
    verificandoAuth,
    iniciarSesionExitosa,
    cerrarSesion,
    limpiarErrores,
    iniciarCarga,
    finalizarCarga
} from '../store';
import { useAppSelector } from './useRedux';
import {
    UsuarioLoginDto,
    UsuarioRegistroDto,
    // ConfirmarEmailDto,
    RespuestaLoginDto,
    UsuarioDto,
    CanalAutenticacion,
    mapearUsuarioALegacy // Solo para métodos legacy
} from '../types/auth.types';
import { authService, configurarInterceptorAuth } from '../services/authService';
// import { HttpStatusCode } from 'axios';

// Configurar interceptor una sola vez
configurarInterceptorAuth();

export const useAuthStore = () => {

    const {
        status,
        usuario,
        errorMessage,
        isLoading
    } = useAppSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Inicia sesión del usuario usando backend español
     */
    const iniciarSesion = async (credenciales: UsuarioLoginDto) => {
        dispatch(iniciarCarga());
        try {
            const respuestaLogin: RespuestaLoginDto = await authService.login(
                credenciales,
                CanalAutenticacion.BACKOFFICE
            );

            // Almacenar sesión
            authService.almacenarSesion(respuestaLogin);

            // Usar directamente el usuario del backend (sin mapeo)
            dispatch(iniciarSesionExitosa(respuestaLogin.usuario));

            dispatch(finalizarCarga());
            dispatch(limpiarErrores());

        } catch (error: unknown) {
            const mensajeError = error instanceof Error ? error.message : 'Usuario o contraseña incorrectos';
            dispatch(cerrarSesion(mensajeError));
            dispatch(finalizarCarga());
        }
    };

    /**
     * Método legacy para compatibilidad
     */
    const startLogin = async ({ email, password }: UsuarioLoginDto) => {
        return await iniciarSesion({ email, password });
    }

    /**
     * Registra un nuevo usuario usando backend español
     */
    const registrarUsuario = async (datosRegistro: UsuarioRegistroDto) => {
        dispatch(iniciarCarga());
        try {
            await authService.registrar(datosRegistro);

            // Almacenar email temporalmente para confirmación
            localStorage.setItem('username_temp', datosRegistro.email);

            // Redirigir a página de confirmación
            dispatch(cerrarSesion('Confirma tu cuenta'));
            navigate('/init/auth/confirm');
            dispatch(finalizarCarga());

        } catch (error: any) {
            const mensajeError = error.message || 'Error en el registro';
            dispatch(cerrarSesion(mensajeError));
            dispatch(finalizarCarga());
        }
    };

    /**
     * Método legacy para compatibilidad
     */
    const startRegister = async ({ email, password, name }: UsuarioRegistroDto) => {
        return await registrarUsuario({ email, password, name });
    }

    /**
     * Confirma el email del usuario usando backend español
     */
    const confirmarEmail = async (codigoConfirmacion: string) => {
        dispatch(iniciarCarga());
        try {
            const email = localStorage.getItem('username_temp');
            if (!email) {
                dispatch(cerrarSesion(''));
                return;
            }

            await authService.confirmarEmail({
                email,
                confirmationCode: codigoConfirmacion
            });

            // Limpiar email temporal y redirigir al login
            localStorage.removeItem('username_temp');
            dispatch(cerrarSesion('Email confirmado exitosamente'));
            navigate('/init/auth/login');
            dispatch(finalizarCarga());

        } catch (error: any) {
            const mensajeError = error.message || 'Por favor volvé a intentar en unos minutos';
            dispatch(cerrarSesion(mensajeError));
            localStorage.removeItem('username_temp');
            dispatch(finalizarCarga());
        }
    };

    /**
     * Método legacy para compatibilidad
     */
    const startConfirm = async (confirmationCode: string) => {
        return await confirmarEmail(confirmationCode);
    }

    /**
     * Verifica y renueva el token de autenticación con usuario en español
     */
    const verificarTokenAuth = async () => {
        const sesion = authService.recuperarSesion();
        const { tokenAcceso, tokenRefresh, usuario } = sesion;
        
        // Verificar que existan los datos mínimos
        if (!tokenAcceso || !tokenRefresh || !usuario) {
            return dispatch(cerrarSesion(''));
        }

        dispatch(verificandoAuth());
        try {
            // Verificar si el token ha expirado
            if (authService.tokenHaExpirado()) {
                // Intentar renovar con refresh token
                try {
                    const respuestaRenovacion = await authService.renovarToken(tokenRefresh);

                    // Actualizar tokens en localStorage
                    localStorage.setItem('t_bo', respuestaRenovacion.accessToken);
                    localStorage.setItem('t_exp_bo', respuestaRenovacion.expiration.toString());

                } catch (errorRenovacion) {
                    // Si falla la renovación, cerrar sesión
                    authService.limpiarSesion();
                    return dispatch(cerrarSesion('Sesión expirada'));
                }
            }

            // Restaurar última ruta y usuario
            const ultimaRuta = authService.obtenerUltimaRuta();
            navigate(ultimaRuta, { replace: true });

            // Parsear y restaurar datos del usuario directamente (sin mapeo)
            const datosUsuario: UsuarioDto = JSON.parse(usuario);
            dispatch(iniciarSesionExitosa(datosUsuario));

        } catch (error) {
            // En caso de error, limpiar todo y cerrar sesión
            authService.limpiarSesion();
            dispatch(cerrarSesion('Error de autenticación'));
        }
    };

    /**
     * Método legacy para compatibilidad (SIN renovación automática)
     * Esta versión básica solo verifica expiración local hasta que se implemente refresh-token
     */
    // const checkAuthToken = async () => {
    //     const sesion = authService.recuperarSesion();
    //     const { tokenAcceso, tokenRefresh, usuario } = sesion;

    //     if (!tokenAcceso || !tokenRefresh || !usuario) {
    //         return dispatch(onLogout(''));
    //     }

    //     dispatch(onChecking());

    //     try {
    //         // Solo verificar expiración local (sin renovación automática)
    //         if (authService.tokenHaExpirado()) {
    //             authService.limpiarSesion();
    //             return dispatch(onLogout('Sesión expirada'));
    //         }

    //         // Restaurar sesión
    //         const ultimaRuta = authService.obtenerUltimaRuta();
    //         navigate(ultimaRuta, { replace: true });

    //         const datosUsuario = JSON.parse(usuario);
    //         const usuarioLegacy = mapearUsuarioALegacy(datosUsuario);
    //         dispatch(onLogin(usuarioLegacy));

    //     } catch (error) {
    //         authService.limpiarSesion();
    //         dispatch(onLogout(''));
    //     }
    // };

    /**
     * Cierra la sesión del usuario
     */
    const cerrarSesionUsuario = () => {
        authService.limpiarSesion();
        dispatch(cerrarSesion(''));
    };

    /**
     * Método legacy para compatibilidad
     */
    // const startLogout = () => {
    //     return cerrarSesionUsuario();
    // };

    return {
        //* Propiedades
        errorMessage,
        status,
        usuario, // Usuario en español directo del backend
        isLoading,

        //* Métodos principales (español)
        iniciarSesion,
        registrarUsuario,
        confirmarEmail,
        verificarTokenAuth,
        cerrarSesion: cerrarSesionUsuario,

        //* Métodos legacy (compatibilidad)
        user: usuario ? mapearUsuarioALegacy(usuario) : null, // Solo mapeo para legacy
        // checkAuthToken,
        // startLogin,
        // startLogout,
        // startRegister,
        // startConfirm
    }

}