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
    Alert
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { AuthLayout, Loading } from '../components';
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
        <AuthLayout title='Fieldpartner - Backoffice'>
            {
                isLoading && <Loading key="loading-auth" loading={true} />
            }
             <form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label="Email"
                            variant='standard'
                            type='email'
                            placeholder='correo@gmail.com'
                            name="email"
                            value={email}
                            error={!!formErrors.email}
                            onChange={handleInputChange}
                            fullWidth />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                autoComplete="off"
                                id="standard-adornment-password"
                                name="password"
                                value={password}
                                onChange={handleInputChange}
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Contraseña'
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                    {
                        errorMessage && (
                            <Alert severity="error" sx={{ my: 1 }} >{errorMessage}</Alert>
                        )
                    }
                    <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <Button
                                type="submit"
                                variant='contained'
                                fullWidth
                                color="primary"
                                onClick={() => handleLogin()}>
                                Ingresar
                            </Button>
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                            <Button variant='contained' fullWidth>
                                <Google />
                                <Typography sx={{ ml: 1 }} > Google</Typography>
                            </Button>
                        </Grid> */}
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}
