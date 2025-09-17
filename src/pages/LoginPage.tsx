// import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Button,
    Alert,
    Typography,
    Box
} from '@mui/material';
import { VisibilityOff, Visibility, Login as LoginIcon } from '@mui/icons-material';
import { AuthLayout, Loading } from '../components';
import { useAppDispatch, useAuthStore, useFormValid } from '../hooks';
import { clearErrorMessage } from '../store';
import { UsuarioLoginDto, validarEmail, validarPassword } from '../types';

const datosIniciales: UsuarioLoginDto = {
    email: '',
    password: '',
};

const erroresIniciales = {
    email: '',
    password: '',
};

export const LoginPage: React.FC = () => {

    const dispatch = useAppDispatch();
    const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
    const [erroresValidacion, setErroresValidacion] = useState(erroresIniciales);

    const {
        errorMessage,
        isLoading,
        iniciarSesion,
        startLogin // Mantener para compatibilidad
    } = useAuthStore();

    const {
        email,
        password,
        formErrors,
        setFormErrors,
        handleInputChange
    } = useFormValid(datosIniciales, erroresIniciales);

    /**
     * Valida los datos del formulario
     */
    const validarFormulario = (): boolean => {
        const errores = {
            email: '',
            password: ''
        };

        // Validar email
        if (!email.trim()) {
            errores.email = 'El email es obligatorio';
        } else if (!validarEmail(email)) {
            errores.email = 'Ingrese un email válido';
        }

        // Validar contraseña
        if (!password.trim()) {
            errores.password = 'La contraseña es obligatoria';
        } else if (password.length < 6) {
            errores.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErroresValidacion(errores);
        setFormErrors(errores);

        return !errores.email && !errores.password;
    };

    /**
     * Maneja el login usando la nueva implementación en español
     */
    const manejarLogin = async () => {
        if (!validarFormulario()) return;

        try {
            await iniciarSesion({ email: email.toLowerCase().trim(), password });
        } catch (error) {
            console.error('Error en login:', error);
        }
    };

    /**
     * Maneja el envío del formulario
     */
    const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        manejarLogin();
    };

    /**
     * Método legacy para compatibilidad
     */
    const handleLogin = () => {
        return manejarLogin();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin();
    };

    useEffect(() => {
        // Limpiar errores al desmontar el componente
        return () => {
            dispatch(clearErrorMessage());
            setErroresValidacion(erroresIniciales);
        };
    }, [dispatch]);

    return (
        <AuthLayout title='FieldPartner - Backoffice'>
            {isLoading && <Loading key="loading-auth" loading={true} />}

            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    Iniciar Sesión
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Accede a tu cuenta del backoffice
                </Typography>
            </Box>

            <form onSubmit={manejarEnvio}>
                <Grid container spacing={3}>
                    {/* Campo Email */}
                    <Grid item xs={12}>
                        <TextField
                            label="Email *"
                            variant="outlined"
                            type="email"
                            placeholder="usuario@ejemplo.com"
                            name="email"
                            value={email}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            onChange={handleInputChange}
                            fullWidth
                            autoComplete="email"
                            inputProps={{
                                style: { textTransform: 'lowercase' }
                            }}
                        />
                    </Grid>

                    {/* Campo Contraseña */}
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña *"
                            variant="outlined"
                            type={mostrarPassword ? 'text' : 'password'}
                            placeholder="Ingrese su contraseña"
                            name="password"
                            value={password}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            onChange={handleInputChange}
                            fullWidth
                            autoComplete="current-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="mostrar/ocultar contraseña"
                                            onClick={() => setMostrarPassword(!mostrarPassword)}
                                            edge="end"
                                            size="large"
                                        >
                                            {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Mostrar error del servidor */}
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Alert
                                severity="error"
                                onClose={() => dispatch(clearErrorMessage())}
                                sx={{ mt: 1 }}
                            >
                                {errorMessage}
                            </Alert>
                        </Grid>
                    )}

                    {/* Botón de Login */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isLoading}
                            startIcon={<LoginIcon />}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem'
                            }}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </Grid>

                    {/* Información adicional */}
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                FieldPartner Backoffice - Versión 2.0<br />
                                Solo usuarios administradores pueden acceder
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    );
};
