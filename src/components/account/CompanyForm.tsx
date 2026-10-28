import { Box, Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import {
    BusinessOutlined,
    FileUploadOutlined,
    CloseRounded,
    ImageOutlined,
} from '@mui/icons-material';
import React, { ChangeEvent, SetStateAction, useState } from 'react';
import { urlImg } from '../../config';
import { Account } from '../../interfaces/account';
import { FormCard } from '../ui';

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
        <>
            <FormCard title="Datos de compañía" icon={<BusinessOutlined />}>
                <Grid
                    container
                    spacing={2}>
                    <Grid item xs={12} sm={3} >
                        <TextField
                            variant="outlined"
                            type='text'
                            label="Cliente ID"
                            disabled
                            value={formValues.accountReference}
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={5} >
                        <TextField
                            variant="outlined"
                            type='text'
                            label="Denominación"
                            disabled
                            value={formValues.denomination}
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            type='text'
                            label="País"
                            disabled
                            value={formValues.country}
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            variant="outlined"
                            type='text'
                            label="Razón social"
                            name="socialReason"
                            value={formValues.socialReason}
                            onChange={handleInputChange}
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            variant="outlined"
                            type='text'
                            label="Nombre fantasía"
                            name="fantasyName"
                            value={formValues.fantasyName}
                            onChange={handleInputChange}
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            variant="outlined"
                            type='text'
                            label="Clave tributaria"
                            name="trybutaryCode"
                            value={formValues.trybutaryCode}
                            onChange={handleInputChange}
                            fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <TextField
                            variant="outlined"
                            type='text'
                            label="Código postal"
                            name="zipCode"
                            value={formValues.zipCode}
                            onChange={handleInputChange}
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
                            fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Teléfono"
                            variant="outlined"
                            type='text'
                            name="phone"
                            value={formValues.phone}
                            onChange={handleInputChange}
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
                            fullWidth />
                    </Grid>
                </Grid>
            </FormCard>

            <FormCard title="Logo" icon={<ImageOutlined />} delay={100}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {/* Vista previa del logo */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 220,
                            height: 120,
                            flexShrink: 0,
                            overflow: 'hidden',
                            borderRadius: '10px',
                            background: 'var(--inset)',
                            boxShadow: 'var(--shadow-hairline)',
                            color: 'var(--ink-3)',
                        }}
                    >
                        {
                            (urlFile || formValues.companyLogo) ? (
                                <Box
                                    component="img"
                                    sx={{ width: '100%', height: '100%', objectFit: "contain" }}
                                    src={urlFile || `${urlImg}/${formValues.companyLogo}`}
                                    alt="Logo"
                                />
                            ) :
                                <ImageOutlined sx={{ fontSize: 32 }} />
                        }
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {
                            !(urlFile || formValues.companyLogo) ? (
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<FileUploadOutlined />}
                                >
                                    Subir logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleFileUpload} />
                                </Button>
                            ) :
                                <Tooltip title="Quitar logo">
                                    <IconButton
                                        onClick={handleCancelFile}
                                        aria-label="Quitar logo"
                                        sx={{ color: 'var(--ink-3)', '&:hover': { color: 'var(--red)', backgroundColor: 'var(--red-tint)' } }}
                                    >
                                        <CloseRounded />
                                    </IconButton>
                                </Tooltip>
                        }
                    </Box>
                </Box>
            </FormCard>
        </>
    )
}
