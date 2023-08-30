import React, { ChangeEvent } from 'react';
import { Grid, TextField, InputAdornment, Alert, AlertTitle } from '@mui/material';
// import { User } from '../types';


export interface UserFormProps {
    // user: User;
    setUser: ({ target }: ChangeEvent<HTMLInputElement>) => void;
    isNewUser?: boolean;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    previousPassword?: string;
    newPassword?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
    setUser,
    isNewUser = true,
    nombre,
    apellido,
    email,
    password,
    previousPassword,
    newPassword
}) => {

    return (
        <form>
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
                        onChange={setUser}
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
                        onChange={setUser}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" />,
                        }}
                        fullWidth />
                </Grid>
                {
                    isNewUser ? (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    // disabled={disabledFields}
                                    type='email'
                                    name="email"
                                    value={email}
                                    onChange={setUser}
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
                                    onChange={setUser}
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
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contraseña actual"
                                    variant="outlined"
                                    // disabled={disabledFields}
                                    type='password'
                                    name="previousPassword"
                                    value={previousPassword}
                                    onChange={setUser}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" />,
                                    }}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nueva contraseña"
                                    variant="outlined"
                                    // disabled={disabledFields}
                                    type='password'
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={setUser}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" />,
                                    }}
                                    fullWidth />
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </form>
    )
}
