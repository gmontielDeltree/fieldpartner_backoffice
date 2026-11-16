import React, { ChangeEvent } from 'react';
import {
    Box, Grid, TextField, InputAdornment, Alert, AlertTitle,
    FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
// import { User } from '../types';


export interface UserFormProps {
    // user: User;
    setUser: ({ target }: ChangeEvent<HTMLInputElement>) => void;
    isNewUser?: boolean;
    username: string;
    email: string;
    password: string;
    previousPassword?: string;
    newPassword?: string;
    // Selector de cuenta: solo en alta y solo para GENERAL_ADMIN (al ADMIN el back le fuerza su cuenta).
    showAccountSelector?: boolean;
    accounts?: { id: string; denomination: string }[];
    accountId?: string;
    onAccountChange?: (id: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
    setUser,
    isNewUser = true,
    username,
    email,
    password,
    previousPassword,
    newPassword,
    showAccountSelector = false,
    accounts = [],
    accountId = '',
    onAccountChange,
}) => {

    return (
        <form>
            <Grid
                container
                spacing={2}>
                {
                    isNewUser && showAccountSelector && (
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <InputLabel id="account-select-label">Cuenta</InputLabel>
                                <Select
                                    labelId="account-select-label"
                                    label="Cuenta"
                                    value={accountId}
                                    onChange={(e) => onAccountChange?.(e.target.value as string)}
                                >
                                    {accounts.map((a) => (
                                        <MenuItem key={a.id} value={a.id}>{a.denomination}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )
                }
                <Grid item xs={12} sm={12}>
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        type='text'
                        name="username"
                        value={username}
                        onChange={setUser}
                        fullWidth />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                    <TextField
                        label="Apellido"
                        variant="outlined"
                        type='text'
                        name="apellido"
                        value={apellido}
                        onChange={setUser}
                        fullWidth />
                </Grid> */}
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
                                        endAdornment: <InputAdornment position="end">@</InputAdornment>
                                    }}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Contraseña"
                                    variant="outlined"
                                    // disabled={disabledFields}
                                    type='password'
                                    name="password"
                                    value={password}
                                    onChange={setUser}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} >
                                <Alert severity="warning">
                                    <AlertTitle>La contraseña debe tener al menos:</AlertTitle>
                                    <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
                                        <li>Una minúscula.</li>
                                        <li>Una mayúscula.</li>
                                        <li>Un carácter especial.</li>
                                        <li>Un número.</li>
                                    </Box>
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
                                    fullWidth />
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </form>
    )
}
