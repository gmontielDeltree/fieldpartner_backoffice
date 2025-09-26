/**
 * Formulario de Compañía - Adaptado de CompanyForm original para cuentas
 * Solo para categoría A: compañía + contratoSocietario + compañíaPorContrato
 */

import { Box, Button, Card, CardMedia, Grid, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import {
    Phone as PhoneIcon,
    CloudUpload as CloudUploadIcon,
    Cancel as CancelIcon,
    DoDisturb as DoDisturbIcon
} from '@mui/icons-material';
import React, { useState } from 'react';
import { CrearCompaniaDto, CrearCuentaDto } from '../types';

interface CuentaFormCompaniaProps {
    formData: CrearCuentaDto;
    setFormData: React.Dispatch<React.SetStateAction<CrearCuentaDto>>;
    // handleInputChange: (field: keyof CrearCuentaDto, value: any) => void;
    handleCompaniaChange: (field: keyof CrearCompaniaDto, value: any) => void;
    setLogoFile: (logo: File | null) => void;
}

export const CuentaFormCompania: React.FC<CuentaFormCompaniaProps> = ({
    formData,
    setLogoFile,
    // setFormData,
    // handleInputChange,
    handleCompaniaChange,
}) => {
    const [urlFile, setUrlFile] = useState('');
    // const [logoFile, setLogoFile] = useState<File | null>(null);

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const fileNameOriginal = file.name;
            const extensionPos = fileNameOriginal.lastIndexOf(".");
            const fileType = fileNameOriginal.substring(extensionPos, fileNameOriginal.length);

            const newFileName = `company-logo-${formData.referenciaCuenta}${fileType}`;
            const renamedFile = new File([file], newFileName, { type: file.type });
            const fileURL = URL.createObjectURL(renamedFile);

            setUrlFile(fileURL);
            setLogoFile(renamedFile);
            handleCompaniaChange('logoCompania', newFileName);
        }
    };

    const handleCancelFile = () => {
        setUrlFile("");
        setLogoFile(null);
        handleCompaniaChange('logoCompania', '');
    };

    return (
        <Grid container spacing={2} alignItems="center">
            {/* Campos de solo lectura */}
            {/* <Grid item xs={12} sm={3}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Cliente ID"
                    disabled
                    value={formData.referenciaCuenta}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Denominación"
                    disabled
                    value={formData.denominacion}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="País"
                    disabled
                    value={formData.paisId}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid> */}

            {/* Campos de compañía editables */}
            <Grid item xs={12} sm={5}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Razón Social"
                    name="razonSocial"
                    value={formData.compania?.razonSocial || ''}
                    onChange={(e) => handleCompaniaChange('razonSocial', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Nombre Fantasía"
                    name="nombreFantasia"
                    value={formData.compania?.nombreFantasia || ''}
                    onChange={(e) => handleCompaniaChange('nombreFantasia', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Código Tributario"
                    name="codigoTributario"
                    value={formData.compania?.codigoTributario || ''}
                    onChange={(e) => handleCompaniaChange('codigoTributario', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Código Postal"
                    name="codigoPostal"
                    value={formData.compania?.codigoPostal || ''}
                    onChange={(e) => handleCompaniaChange('codigoPostal', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Provincia"
                    variant="outlined"
                    type='text'
                    name="provincia"
                    value={formData.compania?.provincia || ''}
                    onChange={(e) => handleCompaniaChange('provincia', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Localidad"
                    variant="outlined"
                    type='text'
                    name="localidad"
                    value={formData.compania?.localidad || ''}
                    onChange={(e) => handleCompaniaChange('localidad', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Dirección"
                    variant="outlined"
                    type='text'
                    name="direccion"
                    value={formData.compania?.direccion || ''}
                    onChange={(e) => handleCompaniaChange('direccion', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>

            <Grid item xs={12} sm={3}>
                <TextField
                    label="Teléfono"
                    variant="outlined"
                    type='text'
                    name="telefono"
                    value={formData.compania?.telefono || ''}
                    onChange={(e) => handleCompaniaChange('telefono', e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <PhoneIcon />
                            </InputAdornment>)
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Sitio Web"
                    variant="outlined"
                    type='text'
                    name="sitioWeb"
                    value={formData.compania?.sitioWeb || ''}
                    onChange={(e) => handleCompaniaChange('sitioWeb', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    label="Observaciones"
                    variant="outlined"
                    type='text'
                    name="observacion"
                    value={formData.compania?.observacion || ''}
                    onChange={(e) => handleCompaniaChange('observacion', e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>

            {/* Sección de logo */}
            <Grid item xs={12} sm={12} sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column-reverse",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {
                    !(urlFile || formData.compania?.logoCompania) ? (
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                        >
                            Subir Logo
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={onChangeFile} />
                        </Button>
                    ) :
                        <IconButton onClick={handleCancelFile} color="error" sx={{ p: 0, pl: 1 }}>
                            <CancelIcon fontSize="large" />
                        </IconButton>
                }

                <Box display="inline-block" component={Paper} sx={{ mb: 1 }}>
                    {
                        (urlFile || formData.compania?.logoCompania) ? (
                            <Card sx={{ maxWidth: "220px", height: "120px" }}>
                                <CardMedia
                                    component="img"
                                    sx={{ objectFit: "contain" }}
                                    image={urlFile || `${formData.compania?.logoCompania}`}
                                    alt="Logo"
                                />
                            </Card>
                        ) :
                            <Box sx={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DoDisturbIcon fontSize="large" color="disabled" />
                            </Box>
                    }
                </Box>
            </Grid>
        </Grid>
    );
};