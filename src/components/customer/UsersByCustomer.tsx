import React, { ChangeEvent } from 'react';
import { Grid, TextField, InputAdornment, Alert, AlertTitle } from '@mui/material';
import { Customer } from '../../types';


export interface UsersByCustomerProps {
    customer: Customer;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}

export const UsersByCustomer: React.FC<UsersByCustomerProps> = ({
    customer,
    setCustomer
}) => {

    const {
        nombre,
        apellido,
        email,
        password } = customer.usuario;

    const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;
        setCustomer(prevState => ({
            ...prevState,
            usuario: {
                ...prevState.usuario,
                [name]: value
            }
        }));
    }

    return (
        <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            mb={3}>
            {/* <Grid item xs={12} display="flex" alignItems="center" mb={2}>
                <GroupIcon sx={{ mx: 1 }} />
                <Typography variant="h5">
                    Usuario
                </Typography>
            </Grid> */}
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Nombre"
                    variant="outlined"
                    type='text'
                    name="nombre"
                    value={nombre}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Apellido"
                    variant="outlined"
                    type='text'
                    name="apellido"
                    value={apellido}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Email"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='email'
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    InputProps={{
                        // startAdornment: <InputAdornment position="start" />,
                        endAdornment: <InputAdornment position="end">@</InputAdornment>
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Password"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='password'
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} >
                <Alert severity="warning">
                    <AlertTitle>La contraseña debe tener al menos:</AlertTitle>
                    <strong>-Una minúscula.</strong><br />
                    <strong>-Una mayúscula.</strong><br />
                    <strong>-Un carácter especial.</strong><br />
                    <strong>-Un número.</strong>
                </Alert>
            </Grid>
        </Grid>
    )
}
