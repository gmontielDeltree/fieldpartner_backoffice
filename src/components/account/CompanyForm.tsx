import { Box, Button, Card, CardMedia, Grid, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import {
    Phone as PhoneIcon,
    CloudUpload as CloudUploadIcon,
    Cancel as CancelIcon,
    DoDisturb as DoDisturbIcon
} from '@mui/icons-material';
import React, { ChangeEvent, SetStateAction, useState } from 'react';
import { urlImg } from '../../config';
import { Account } from '../../interfaces/account';

export interface CompanyFormProps {
    formValues: Account,
    setFormValues: React.Dispatch<React.SetStateAction<Account>>,
    handleInputChange: ({ target }: ChangeEvent<HTMLInputElement>) => void,
    setFile: React.Dispatch<SetStateAction<File | null>>;
    // handleCheckboxChange: ({ target }: ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
    formValues,
    setFormValues,
    handleInputChange,
    setFile,
}) => {

    const [urlFile, setUrlFile] = useState('');
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const fileNameOriginal = file.name;
            const extensionPos = fileNameOriginal.lastIndexOf(".");
            const fileType = fileNameOriginal.substring(extensionPos, fileNameOriginal.length);

            const newFileName = `company-logo-${formValues.accountReference}${fileType}`;
            const renamedFile = new File([file], newFileName, { type: file.type });
            const fileURL = URL.createObjectURL(renamedFile);

            setUrlFile(fileURL);
            setFile(renamedFile);
            setFormValues(prevState => ({ ...prevState, companyLogo: newFileName }));
        }
    };

    const handleCancelFile = () => {
        setUrlFile("");
        setFile(null);
        setFormValues(prevState => ({ ...prevState, companyLogo: "" }));
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
                    label="Cliente ID"
                    disabled
                    value={formValues.accountReference}
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
                    value={formValues.denomination}
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
                    value={formValues.country}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={5}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Razon Social"
                    name="socialReason"
                    value={formValues.socialReason}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Nombre Fantasia"
                    name="fantasyName"
                    value={formValues.fantasyName}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    variant="outlined"
                    type='text'
                    label="Clave Tributaria"
                    name="trybutaryCode"
                    value={formValues.trybutaryCode}
                    onChange={handleInputChange}
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
                    name="zipCode"
                    value={formValues.zipCode}
                    onChange={handleInputChange}
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
                    name="province"
                    value={formValues.province}
                    onChange={handleInputChange}
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
                    name="locality"
                    value={formValues.locality}
                    onChange={handleInputChange}
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
                    name="address"
                    value={formValues.address}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>

            <Grid item xs={12} sm={3}>
                <TextField
                    label="Telefono"
                    variant="outlined"
                    type='text'
                    name="phone"
                    value={formValues.phone}
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
            <Grid item xs={12} sm={3}>
                <TextField
                    label="Contacto secundario"
                    variant="outlined"
                    type='text'
                    name="secondaryContact"
                    value={formValues.secondaryContact}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    label="Web"
                    variant="outlined"
                    type='text'
                    name="website"
                    value={formValues.website}
                    onChange={handleInputChange}
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
                    name="observation"
                    value={formValues.observation}
                    onChange={handleInputChange}
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
                    !(urlFile || formValues.companyLogo) ? (
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
                        (urlFile || formValues.companyLogo) ? (
                            <Card sx={{ maxWidth: "220px", height: "120px" }}>
                                <CardMedia
                                    component="img"
                                    sx={{ objectFit: "contain" }}
                                    image={urlFile || `${urlImg}/${formValues.companyLogo}`}
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
