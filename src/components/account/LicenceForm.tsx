import { Alert, AlertTitle, Autocomplete, Box, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, ListItemText, Paper, TextField, Tooltip, Typography } from '@mui/material';
import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { Country, EnumCategoryAccount, EnumStatusAccount, EnumLicenceType, Licences, UserDto } from '../../types'
import { Account } from '../../interfaces/account';
import { enumToArray, regexEmail } from '../../helpers';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAccount } from '../../hooks';


interface LicenceFormProps {
    formValues: Account,
    countries: Country[],
    licences: Licences[],
    setFormValues: React.Dispatch<React.SetStateAction<Account>>,
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

    const { getUserByEmail } = useAccount();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorToEmailAssociation, setErrorToEmailAssociation] = useState<boolean>(false);
    const [countrySelected, setCountrySelected] = useState<Country | null>(null);
    const countryOptions = countries.map(c => ({ code: c.code, label: c.descriptionEN }));
    const statusOptions = Object.values(EnumStatusAccount).map(x => x as string);
    const categoryOptions = enumToArray(EnumCategoryAccount);
    const licenceTypeOptions = Object.values(EnumLicenceType).map(x => x as string);

    const licencesOptions = licences.
        filter(l => l.licenceType.toLowerCase() === formValues.licenceType.toLowerCase())
        .map(x => ({ code: x.id, label: x.id, allowedUnit: x.maximumUnitAllowed }));

    const onChangeCountry = (_event: SyntheticEvent, value: { code: string; label: string } | null) => {
        const countryFound = countries.find(c => c.code === value?.code);
        if (countryFound) {
            setCountrySelected(countryFound);
            setFormValues(prevState => ({ ...prevState, country: countryFound.code }));
        }
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
            setFormValues(prevState => ({ ...prevState, licence: value.code, amountLicencesAllowed: Number(value.allowedUnit) }));
    }

    const onChangeUser = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;
        setFormValues(prevState => ({
            ...prevState,
            user: { ...prevState.user!, [name]: value } as UserDto
        }));
    }

    const onBlurEmailToAssociate = async () => {
        const email = formValues.emailToAssociate.trim();
        if (email && regexEmail.test(email)) {
            const user = await getUserByEmail(email);
            if (user) setErrorToEmailAssociation(false);
            else setErrorToEmailAssociation(true);
        }
    }

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2.5} >
                <TextField
                    variant="outlined"
                    type='text'
                    label="Cuenta ID"
                    name="accountReference"
                    disabled={!!formValues.accountId}
                    value={formValues.accountReference}
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
                    disabled={!!formValues.accountId}
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
                    disabled={!!formValues.accountId}
                    options={countryOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Pais" variant="outlined" />
                    )}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={2} textAlign="center">
                <FormControl fullWidth>
                    <ListItemText
                        primary={<Typography color="GrayText" variant='subtitle2'>Moneda</Typography>}
                        secondary={
                            <Typography sx={{ fontWeight: "bold" }} letterSpacing={1} variant='subtitle1'>
                                {countrySelected?.currency || "-"}
                            </Typography>}
                    />
                </FormControl>

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
                    disabled={!!formValues.accountId}
                    disableClearable={false}
                    disableCloseOnSelect={false}
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
            <Grid item xs={12} sm={2}>
                <FormControlLabel control={
                    <Checkbox
                        name="isLicenceMultipleCountry"
                        checked={formValues.isLicenceMultipleCountry}
                        onChange={handleCheckboxChange}
                        defaultChecked />}
                    label="Licencia Multipais" />
            </Grid>
            <Grid item xs={12} sm={3}>
                <Autocomplete
                    value={formValues.licenceType || null}
                    onChange={onChangeLicenceType}
                    disabled={!!formValues.accountId}
                    options={licenceTypeOptions}
                    // getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Tipo Licencia" variant="outlined" />
                    )}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <Autocomplete
                    value={licencesOptions.find(x => x.code === formValues.licence) || null}
                    onChange={onChangeLicence}
                    disabled={!!formValues.accountId}
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
            <Grid item xs={12} sm={12} alignItems="center" sx={{ mt: 2 }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <FormControlLabel
                        sx={{ mb: 3 }}
                        control={<Checkbox
                            name="associateUser"
                            checked={formValues.associateUser}
                            onChange={(e, c) => {
                                handleCheckboxChange(e, c);
                                if (!c) {
                                    // Si el checkbox se desmarca, limpiamos el email
                                    setFormValues(prev => ({
                                        ...prev,
                                        emailToAssociate: ''
                                    }));
                                }
                            }} />}
                        label={<Typography fontWeight={400} variant="h5">Asociar a un usuario existente</Typography>} />
                    {
                        formValues.associateUser && (
                            <TextField
                                variant="outlined"
                                sx={{ width: "50%", mt: 1 }}
                                type='email'
                                label="Email a asociar"
                                name="emailToAssociate"
                                color={
                                    (regexEmail.test(formValues.emailToAssociate) && errorToEmailAssociation)
                                        ? 'error'
                                        : (regexEmail.test(formValues.emailToAssociate) && !errorToEmailAssociation) ? 'success' : 'secondary'
                                }
                                value={formValues.emailToAssociate}
                                focused
                                onBlur={onBlurEmailToAssociate}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">@</InputAdornment>
                                }} />
                        )
                    }
                </Box>
                {
                    !formValues.associateUser && (
                        <Paper variant='outlined' elevation={2} sx={{ width: "60%", p: 2, margin: "auto" }}>
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
                                        value={formValues?.user?.username}
                                        onChange={onChangeUser}
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
                                        value={formValues.user?.email}
                                        onChange={onChangeUser}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">@</InputAdornment>
                                        }}
                                        fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Password"
                                        variant="outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        size='small'
                                        value={formValues.user?.password}
                                        onChange={onChangeUser}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title={
                                                        <Alert severity="warning">
                                                            <AlertTitle>La contraseña debe cumplir con los siguientes requisitos:</AlertTitle>
                                                            <strong>-Mínimo 8 caracteres.</strong><br />
                                                            <strong>-Una mayúscula.</strong><br />
                                                            <strong>-Un número.</strong><br />
                                                            <strong>-Un carácter especial.</strong><br />
                                                        </Alert>
                                                    }>
                                                        <IconButton>
                                                            <InfoIcon fontSize='small' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="start" > <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton></InputAdornment>
                                            )
                                        }}
                                        fullWidth />
                                </Grid>
                            </Grid>
                        </Paper>
                    )
                }
            </Grid>
        </Grid >
    )
}
