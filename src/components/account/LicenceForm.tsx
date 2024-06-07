import { FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'
import { TipoLicencia } from '../../types'

export const LicenceForm: React.FC = () => {
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Denominacion"
                    name="documento"
                    // value={documento}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                    <InputLabel id="pais">Pais</InputLabel>
                    <Select
                        labelId="pais"
                        name='tipoEntidad'
                        // value={tipoEntidad}
                        label="Pais"
                    // onChange={handleSelectChange}
                    >
                        <MenuItem value={"fi"}>Fisica</MenuItem>
                        <MenuItem value={"ju"}>Jurídica</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={5} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Documento"
                    name="documento"
                    // value={documento}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Nombre completo"
                    name="nombreCompleto"
                    // value={nombreCompleto}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <TextField
                    label="Cuit"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="cuit"
                    // value={cuit}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <TextField
                    label="Razon Social"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="razonSocial"
                    // value={razonSocial}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                    <InputLabel id="label-tipo-licencia">Tipo licencia</InputLabel>
                    <Select
                        labelId="label-tipo-licencia"
                        name='tipoLicencia'
                        // value={tipoLicencia}
                        label="Tipo licencia"
                    // onChange={selectChangeAccount}
                    >
                        <MenuItem value={TipoLicencia.LFPC05.toString()}>Hasta 5 campos</MenuItem>
                        <MenuItem value={TipoLicencia.LFPC10.toString()}>Hasta 10 campos</MenuItem>
                        <MenuItem value={TipoLicencia.LFPCPLUS.toString()}>Hasta 100 campos</MenuItem>
                        <MenuItem value={TipoLicencia.LFPINT.toString()}>Interna</MenuItem>
                        <MenuItem value={TipoLicencia.LFPDEM.toString()}>Demo</MenuItem>
                        <MenuItem value={TipoLicencia.LFPFREE.toString()}>Free</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={7}>
                <TextField
                    label="Descripcion"
                    variant="outlined"
                    type='text'
                    name="descripcion"
                    // value={descripcion}
                    // onChange={handleInputChangeAccount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} >
                <TextField
                    key="inicio-licencia"
                    variant="outlined"
                    type='date'
                    label="Inicio de licencia"
                    name="inicioLicencia"
                    // value={inicioLicencia}
                    // onChange={handleInputChangeAccount}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} >
                <TextField
                    key="fin-licencia"
                    variant="outlined"
                    type='date'
                    label="Fin de licencia"
                    name="finLicencia"
                    // value={finLicencia}
                    // onChange={handleInputChangeAccount}
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
                    // value={email}
                    // onChange={handleInputChange}
                    InputProps={{
                        // startAdornment: <InputAdornment position="start" />,
                        endAdornment: <InputAdornment position="end">@</InputAdornment>
                    }}
                    fullWidth />
            </Grid>
        </Grid>
    )
}
