import React, { ChangeEvent } from 'react';
import { Grid, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { Customer, TipoEntidad, TipoLicencia } from '../../types';



export interface InformationFormProps {
    customer: Customer;
    handleInputChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: ({ target }: SelectChangeEvent) => void;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;

}

export const InformationForm: React.FC<InformationFormProps> = ({
    customer,
    handleInputChange,
    handleSelectChange,
    setCustomer
}) => {

    const {
        nombreCompleto,
        documento,
        email,
        telefono,
        cuit,
        contactoPrincipal,
        contactoSecundario,
        tipoEntidad,
        razonSocial,
        account,
        sitioWeb } = customer;
    const {
        descripcion,
        tipoLicencia,
        inicioLicencia,
        finLicencia,
        lenguaje
    } = account;

    const handleInputChangeAccount = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;
        setCustomer(prevState => ({
            ...prevState,
            account: {
                ...prevState.account,
                [name]: value
            }
        }));
    }

    const selectChangeAccount = ({ target }: SelectChangeEvent) => {
        const { name, value } = target;
        setCustomer(prevState => ({
            ...prevState,
            account: {
                ...prevState.account,
                [name]: value
            }
        }));
    }


    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center">
            {/* <Grid item xs={12} display="flex" alignItems="center" mb={2}>
                <InfoIcon sx={{ mx: 1 }} />
                <Typography variant="h5">
                    Informacion basica
                </Typography>
            </Grid> */}
            <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                    <InputLabel id="label-tipo-entidad">Tipo entidad</InputLabel>
                    <Select
                        labelId="label-tipo-entidad"
                        name='tipoEntidad'
                        value={tipoEntidad}
                        label="Tipo entidad"
                        onChange={handleSelectChange}
                    >
                        <MenuItem value={TipoEntidad.FISICA.toString()}>Fisica</MenuItem>
                        <MenuItem value={TipoEntidad.JURIDICA.toString()}>Jurídica</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            {
                (tipoEntidad.toLowerCase() === TipoEntidad.FISICA.toLowerCase()) ? (
                    <>
                        <Grid item xs={12} sm={5} >
                            <TextField
                                variant="outlined"
                                type='text'
                                label="Documento"
                                name="documento"
                                value={documento}
                                onChange={handleInputChange}
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
                                value={nombreCompleto}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" />,
                                }}
                                fullWidth />
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Cuit"
                                variant="outlined"
                                // disabled={disabledFields}
                                type='text'
                                name="cuit"
                                value={cuit}
                                onChange={handleInputChange}
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
                                value={razonSocial}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" />,
                                }}
                                fullWidth />
                        </Grid>
                    </>
                )
            }
            <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                    <InputLabel id="label-tipo-licencia">Tipo licencia</InputLabel>
                    <Select
                        labelId="label-tipo-licencia"
                        name='tipoLicencia'
                        value={tipoLicencia}
                        label="Tipo licencia"
                        onChange={selectChangeAccount}
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
                    value={descripcion}
                    onChange={handleInputChangeAccount}
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
                    value={inicioLicencia}
                    onChange={handleInputChangeAccount}
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
                    value={finLicencia}
                    onChange={handleInputChangeAccount}
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
                    label="Telefono"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="telefono"
                    value={telefono}
                    onChange={handleInputChange}
                    InputProps={{
                        // startAdornment: <InputAdornment position="start" />,
                        endAdornment: (
                            <InputAdornment position="end">
                                <PhoneIcon />
                            </InputAdornment>)
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Contacto principal"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="contactoPrincipal"
                    value={contactoPrincipal}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Contacto secundario"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="contactoSecundario"
                    value={contactoSecundario}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="label-lenguaje">Lenguaje</InputLabel>
                    <Select
                        labelId="label-lenguaje"
                        name='lenguaje'
                        value={lenguaje}
                        label="Lenguaje"
                        onChange={selectChangeAccount}
                    >
                        <MenuItem value="español">Español</MenuItem>
                        <MenuItem value="ingles">Ingles</MenuItem>
                        <MenuItem value="portugues">Portugues</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Sitio web"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="sitioWeb"
                    value={sitioWeb}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
        </Grid>
    )
}
