import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsuarioDto } from '../../types/auth.types';

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    usuario: UsuarioDto | null; // Cambio: usuario en español
    errorMessage: string;
    isLoading: boolean;
}

const initialState: AuthState = {
    status: 'not-authenticated', // 'authenticated','not-authenticated',
    usuario: null, // Cambio: usuario en español
    errorMessage: '',
    isLoading: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        // onChecking: (state) => {
        //     state.status = 'checking';
        //     state.usuario = null;
        //     state.errorMessage = '';
        // },
        // onLogin: (state, action: PayloadAction<UsuarioDto>) => {
        //     state.status = 'authenticated';
        //     state.usuario = action.payload;
        //     state.errorMessage = '';
        // },
        // onLogout: (state, action: PayloadAction<string>) => {
        //     state.status = 'not-authenticated';
        //     state.usuario = null;
        //     state.errorMessage = action.payload;
        // },
        // clearErrorMessage: (state) => {
        //     state.errorMessage = '';
        // },
        // startLoading: (state) => {
        //     state.isLoading = true;
        // },
        // finishLoading: (state) => {
        //     state.isLoading = false;
        // },

        // ==========================================
        // ACTIONS EN ESPAÑOL (NUEVAS)
        // ==========================================
        verificandoAuth: (state) => {
            state.status = 'checking';
            state.usuario = null;
            state.errorMessage = '';
        },
        iniciarSesionExitosa: (state, action: PayloadAction<UsuarioDto>) => {
            state.status = 'authenticated';
            state.usuario = action.payload;
            state.errorMessage = '';
        },
        cerrarSesion: (state, action: PayloadAction<string>) => {
            state.status = 'not-authenticated';
            state.usuario = null;
            state.errorMessage = action.payload;
        },
        limpiarErrores: (state) => {
            state.errorMessage = '';
        },
        iniciarCarga: (state) => {
            state.isLoading = true;
        },
        finalizarCarga: (state) => {
            state.isLoading = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const {
    // Legacy actions (compatibilidad)
    // onChecking,
    // onLogin,
    // onLogout,
    // clearErrorMessage,
    // startLoading,
    // finishLoading,

    // Nuevas actions en español
    verificandoAuth,
    iniciarSesionExitosa,
    cerrarSesion,
    limpiarErrores,
    iniciarCarga,
    finalizarCarga,
} = authSlice.actions;
