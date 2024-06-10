import { Box, Checkbox, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React from 'react'
import { TipoLicencia } from '../../types'

interface LicenceFormProps {

}
export const LicenceForm = () => {


    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2.5} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Account ID"
                    name="accountID"
                    // value={documento}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Denominacion"
                    name="denominacion"
                    // value={documento}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                    <InputLabel id="pais">Pais</InputLabel>
                    <Select
                        labelId="pais"
                        name='pais'
                        // value={tipoEntidad}
                        label="Pais"
                    // onChange={handleSelectChange}
                    >
                        <MenuItem value={"fi"}>Fisica</MenuItem>
                        <MenuItem value={"ju"}>Jurídica</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5} >
                <FormControlLabel control={<Checkbox defaultChecked />} label="Licencia Multipais" />
            </Grid>
            <Grid item xs={12} sm={2} >
                <FormControl fullWidth>
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                        labelId="status"
                        name='status'
                        // value={tipoEntidad}
                        label="Status"
                    // onChange={handleSelectChange}
                    >
                        <MenuItem value={"activo"}>Activa</MenuItem>
                        <MenuItem value={"inactivo"}>Inactiva</MenuItem>
                        <MenuItem value={"suspendido"}>Suspendida</MenuItem>
                        <MenuItem value={"cancelada"}>Cancelada</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} >
                <FormControl fullWidth>
                    <InputLabel id="categoria">Categoria</InputLabel>
                    <Select
                        labelId="categoria"
                        name='categoria'
                        // value={tipoEntidad}
                        label="Categoria"
                    // onChange={handleSelectChange}
                    >
                        <MenuItem value={"A"}>Productores Agropecuarios / Empresas</MenuItem>
                        <MenuItem value={"B"}>Ingenieros Agronomos - Cooperativas - Asociaciones</MenuItem>
                        <MenuItem value={"C"}>Bancos - Seguros</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{
                    display: "flex",
                    p: 2,
                    alignItems: "center",
                    borderRadius: "15px",
                    border: "1px solid #f4f4f4"
                }}>
                    <TextField
                        key="inicio-licencia"
                        variant="outlined"
                        type='date'
                        label="Inicio"
                        name="inicioLicencia"
                        // value={inicioLicencia}
                        // onChange={handleInputChangeAccount}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" />,
                        }}
                        fullWidth />
                    <TextField
                        key="fin-licencia"
                        variant="outlined"
                        type='date'
                        label="Fin"
                        name="finLicencia"
                        fullWidth
                        // value={finLicencia}
                        // onChange={handleInputChangeAccount}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" />,
                        }} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    <InputLabel id="label-tipo-licencia">Tipo licencia</InputLabel>
                    <Select
                        labelId="label-tipo-licencia"
                        name='licenceType'
                        // value={tipoLicencia}
                        label="Tipo licencia"
                    // onChange={selectChangeAccount}
                    >
                        <MenuItem value={TipoLicencia.CAMPO}>{TipoLicencia.CAMPO.toString()}</MenuItem>
                        <MenuItem value={TipoLicencia.LICENCIA}>{TipoLicencia.LICENCIA.toString()}</MenuItem>
                        <MenuItem value={TipoLicencia.HECTAREA}>{TipoLicencia.HECTAREA.toString()}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                    {/* Obtener de la tabla Licencias */}
                    <InputLabel id="label-licence">Licencia</InputLabel>
                    <Select
                        labelId="label-licence"
                        name='licenceType'
                        // value={tipoLicencia}
                        label="Licencia"
                    // onChange={selectChangeAccount}
                    >
                        <MenuItem value={TipoLicencia.CAMPO}>{TipoLicencia.CAMPO.toString()}</MenuItem>
                        <MenuItem value={TipoLicencia.LICENCIA}>{TipoLicencia.LICENCIA.toString()}</MenuItem>
                        <MenuItem value={TipoLicencia.HECTAREA}>{TipoLicencia.HECTAREA.toString()}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} >
                <TextField
                    key="maxUnits"
                    variant="outlined"
                    type='text'
                    label="Unidad Maxima"
                    name="maxUnits"
                    disabled
                    // value={inicioLicencia}
                    // onChange={handleInputChangeAccount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={12} >
                <Paper variant='elevation' elevation={2} sx={{ p: 2 }}>
                    <Typography variant='h6' textAlign="center" sx={{ mb: 2 }}>Licencia Admin</Typography>
                    <Box display="flex" alignItems="center">
                        <TextField
                            key="fin-licencia"
                            variant="outlined"
                            type='text'
                            label="Nombre"
                            name="username"
                            // value={finLicencia}
                            // onChange={handleInputChangeAccount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" />,
                            }}
                            fullWidth />
                        <TextField
                            label="Email"
                            variant="outlined"
                            // disabled={disabledFields}
                            type='email'
                            name="email"
                            // value={email}
                            // onChange={handleInputChange}
                            InputProps={{
                                // startAdornment: <InputAdornment position="start" />,
                                startAdornment: <InputAdornment position="end">@</InputAdornment>
                            }}
                            fullWidth />
                    </Box>
                </Paper>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
            </Grid> */}
        </Grid>
    )
}
