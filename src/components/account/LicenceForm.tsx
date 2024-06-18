import { Autocomplete, Box, Checkbox, FormControlLabel, Grid, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, FC, SyntheticEvent } from 'react';
import { Country, EnumCategoryAccount, EnumStatusAccount, EnumLicenceType, Licences } from '../../types'
import { Customer } from '../../interfaces/customer';
import { enumToArray } from '../../helpers';

interface LicenceFormProps {
    formValues: Customer,
    countries: Country[],
    licences: Licences[],
    setFormValues: React.Dispatch<React.SetStateAction<Customer>>,
    handleInputChange: ({ target }: ChangeEvent<HTMLInputElement>) => void,
    // handleSelectChange?: ({ target }: SelectChangeEvent) => void,
    handleCheckboxChange: ({ target }: ChangeEvent<HTMLInputElement>, checked: boolean) => void
}
export const LicenceForm: FC<LicenceFormProps> = ({
    formValues,
    countries,
    licences,
    setFormValues,
    handleCheckboxChange,
    handleInputChange,
}) => {

    const { username, email, password } = formValues.user;
    const countryOptions = countries.map(c => ({ code: c.code, label: c.descriptionEN }));
    const statusOptions = Object.values(EnumStatusAccount).map(x => x as string);
    const categoryOptions = enumToArray(EnumCategoryAccount);
    const licenceTypeOptions = Object.values(EnumLicenceType).map(x => x as string);
    const licencesOptions = licences.
        filter(l => l.licenceType.toLowerCase() === formValues.licenceType.toLowerCase())
        .map(x => ({ code: x.id, label: x.id, allowedUnit: x.maximumUnitAllowed }));

    const onChangeCountry = (_event: SyntheticEvent, value: { code: string; label: string } | null) => {
        if (value)
            setFormValues(prevState => ({ ...prevState, country: value.code }));
    }

    const onChangeCategory = (_event: SyntheticEvent, value: { code: string; label: string } | null) => {
        if (value)
            setFormValues(prevState => ({ ...prevState, category: value.code }));
    }

    const onChangeStatus = (_event: SyntheticEvent, value: string | null) => {
        if (value)
            setFormValues(prevState => ({ ...prevState, status: value }));
    }

    const onChangeLicenceType = (_event: SyntheticEvent, value: string | null) => {
        if (value) {
            setFormValues(prevState => ({ ...prevState, licenceType: value }));

        }
    }

    const onChangeLicence = (_event: SyntheticEvent, value: { code: string; label: string; allowedUnit: number } | null) => {
        if (value)
            setFormValues(prevState => ({ ...prevState, licence: value.code, amountLicencesAllowed: value.allowedUnit }));
    }

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2.5} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Cuenta ID"
                    name="accountID"
                    value={formValues.accountID}
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
                    label="Denominacion"
                    name="denomination"
                    value={formValues.denomination}
                    onChange={handleInputChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
                <Autocomplete
                    value={countryOptions.find(opts => opts.code === formValues.country) || null}
                    onChange={onChangeCountry}
                    options={countryOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Pais" variant="outlined" />
                    )}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={2.5} >
                <FormControlLabel control={
                    <Checkbox
                        name="isLicenceMultipleCountry"
                        checked={formValues.isLicenceMultipleCountry}
                        onChange={handleCheckboxChange}
                        defaultChecked />}
                    label="Licencia Multipais" />
            </Grid>
            <Grid item xs={12} sm={2} >
                <Autocomplete
                    value={formValues.status}
                    onChange={onChangeStatus}
                    options={statusOptions}
                    // getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Estado" variant="outlined" />
                    )}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4} >
                <Autocomplete
                    value={categoryOptions.find(opts => opts.code === formValues.category) || null}
                    onChange={onChangeCategory}
                    options={categoryOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Categoria" variant="outlined" />
                    )}
                    fullWidth
                />
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
                        name="startDateLicence"
                        value={formValues.startDateLicence}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" />,
                        }}
                        fullWidth />
                    <TextField
                        key="fin-licencia"
                        variant="outlined"
                        type='date'
                        label="Fin"
                        name="endDateLicence"
                        fullWidth
                        value={formValues.endDateLicence}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" />,
                        }} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Autocomplete
                    value={formValues.licenceType || null}
                    onChange={onChangeLicenceType}
                    options={licenceTypeOptions}
                    // getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Tipo Licencia" variant="outlined" />
                    )}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Autocomplete
                    value={licencesOptions.find(x => x.code === formValues.licence) || null}
                    onChange={onChangeLicence}
                    options={licencesOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Licencia" variant="outlined" />
                    )}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={2} >
                <TextField
                    key="maxUnits"
                    variant="outlined"
                    type='text'
                    label="Unidad Maxima"
                    name="maxUnits"
                    disabled
                    value={formValues.amountLicencesAllowed}
                    InputProps={{
                        startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth />
            </Grid>
            <Grid item xs={12} sm={12} alignItems="center">
                <Paper variant='elevation' elevation={1} sx={{ width: "60%", p: 2, margin: "auto" }}>
                    <Typography variant='h6' textAlign="center" sx={{ mb: 2 }}>Licencia Admin</Typography>
                    <Grid container direction="column" spacing={1} >
                        <Grid item xs={12}>
                            <TextField
                                key="fin-licencia"
                                variant="outlined"
                                type='text'
                                label="Nombre"
                                size='small'
                                name="username"
                                value={username}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" />,
                                }}
                                fullWidth />
                        </Grid>
                        <Grid item xs={12} sx={{ my: 1 }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                type='email'
                                name="email"
                                size='small'
                                value={email}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">@</InputAdornment>
                                }}
                                fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                variant="outlined"
                                type='password'
                                name="password"
                                size='small'
                                value={password}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" />,
                                }}
                                fullWidth />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}
