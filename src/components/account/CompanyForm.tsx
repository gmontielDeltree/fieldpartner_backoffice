import { Box, Button, Card, CardMedia, Grid, IconButton, InputAdornment, Paper, TextField } from '@mui/material'
import {
    Phone as PhoneIcon,
    CloudUpload as CloudUploadIcon,
    Cancel as CancelIcon,
    DoDisturb as DoDisturbIcon
} from '@mui/icons-material';
import React, { useState } from 'react';
import uuid4 from "uuid4";
import { urlImg } from '../../config';

export const CompanyForm: React.FC = () => {

    const [urlFile, setUrlFile] = useState('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const fileNameOriginal = file.name;
            const extensionPos = fileNameOriginal.lastIndexOf(".");
            const fileType = fileNameOriginal.substring(extensionPos, fileNameOriginal.length);

            const newFileName = `business-logo-${uuid4()}${fileType}`;
            const renamedFile = new File([file], newFileName, { type: file.type });
            const fileURL = URL.createObjectURL(renamedFile);

            setUrlFile(fileURL);
            // setFile(renamedFile);
            // handleFormValueChange("logoBusiness", newFileName);
        }
    };

    const handleCancelFile = () => {
        setUrlFile("");
        // setFile(null);
        // handleFormValueChange("logoBusiness", "");
    }

    return (
        <Grid
            container
            spacing={2}
            alignItems="center">
            <Grid item xs={12} sm={3} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Account ID"
                    disabled
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
                    label="Denominacion"
                    disabled
                    // value={documento}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Pais"
                    disabled
                    // value={documento}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <TextField
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    label="Razon Social"
                    name="razonSocial"
                    // value={razonSocial}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    label="Nombre Fantasia"
                    name="nombreFantasia"
                    // value={razonSocial}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    label="Clave Tributaria"
                    // name="nombreFantasia"
                    // value={razonSocial}
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
                    label="Codigo postal"
                    name="cp"
                    // // value={cp}
                    // // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Provincia"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="provincia"
                    // value={provincia}
                    // onChange={handleInputChange}
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
                    // value={localidad}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Domicilio"
                    variant="outlined"
                    type='text'
                    name="domicilio"
                    // value={domicilio}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Telefono"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="telefono"
                    // value={telefono}
                    // onChange={handleInputChange}
                    InputProps={{
                        // startAdornment: <InputAdornment position="start" />,
                        endAdornment: (
                            <InputAdornment position="end">
                                <PhoneIcon />
                            </InputAdornment>)
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Contacto principal"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="contactoPrincipal"
                    // value={contactoPrincipal}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Web"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="web"
                    // value={contactoPrincipal}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={8}>
                <TextField
                    label="Observaciones"
                    variant="outlined"
                    // disabled={disabledFields}
                    type='text'
                    name="observations"
                    // value={contactoPrincipal}
                    // onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={12} sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column-reverse",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {
                    !(urlFile) ? (
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
                                onChange={handleFileUpload} />
                        </Button>
                    ) :
                        <IconButton onClick={handleCancelFile} color="error" sx={{ p: 0, pl: 1 }}>
                            <CancelIcon fontSize="large" />
                        </IconButton>
                }

                <Box display="inline-block" component={Paper} sx={{ mb: 1 }}>
                    {
                        (urlFile) ? (
                            <Card sx={{ maxWidth: "220px", height: "120px" }}>
                                <CardMedia
                                    component="img"
                                    sx={{ objectFit: "contain" }}
                                    image={urlFile || `${urlImg}`}
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
    )
}
