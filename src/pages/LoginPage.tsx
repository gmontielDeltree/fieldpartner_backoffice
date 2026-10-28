// import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Alert
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { AuthFieldLabel, AuthHeader, Loading, authEnter } from '../components';
import { useAppDispatch, useAuthStore, useFormValid } from '../hooks';
import { clearErrorMessage } from '../store';

const initialState = {
    email: '',
    password: '',
};
const initialErrors = structuredClone(initialState);

export const LoginPage: React.FC = () => {

    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {
        errorMessage,
        isLoading,
        startLogin
    } = useAuthStore();
    const {
        email,
        password,
        formErrors,
        setFormErrors,
        handleInputChange } = useFormValid(initialState, initialErrors);

    const handleLogin = () => {

        if (email === '' || password === '') {
            setFormErrors(prevState => ({
                ...prevState,
                email: !(email) ? 'Ingrese su email.' : '',
                password: !(password) ? 'Ingrese su contraseña ' : ''
            }));
            return
        }
        startLogin({ email, password });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin();
    };

    useEffect(() => {
        return () => {
            dispatch(clearErrorMessage())
        }
    }, [dispatch])


    return (
        <Box>
            {
                isLoading && <Loading key="loading-auth" loading={true} />
            }
            <AuthHeader title="Ingresá al Backoffice" subtitle="Usá tu cuenta de administrador de FieldPartner." />

            <Box component="form" noValidate onSubmit={handleSubmit} sx={authEnter(60)}>
                <Box sx={{ mb: 2 }}>
                    <AuthFieldLabel htmlFor="email">Email</AuthFieldLabel>
                    <TextField
                        id="email"
                        type='email'
                        placeholder='correo@gmail.com'
                        name="email"
                        value={email}
                        error={!!formErrors.email}
                        helperText={formErrors.email || ''}
                        onChange={handleInputChange}
                        autoComplete="email"
                        autoFocus
                        fullWidth />
                </Box>

                <Box>
                    <AuthFieldLabel htmlFor="password">Contraseña</AuthFieldLabel>
                    <TextField
                        id="password"
                        autoComplete="current-password"
                        name="password"
                        value={password}
                        error={!!formErrors.password}
                        helperText={formErrors.password || ''}
                        onChange={handleInputChange}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Contraseña'
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                        sx={{ color: 'var(--ink-3)', '&:hover': { color: 'var(--ink-2)' } }}
                                    >
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                {
                    errorMessage && (
                        <Alert severity="error" sx={{ mt: 2 }} >{errorMessage}</Alert>
                    )
                }
                <Button type="submit" variant='contained' fullWidth size="large" sx={{ mt: 3 }}>
                    Ingresar
                </Button>
            </Box>
        </Box>
    )
}
