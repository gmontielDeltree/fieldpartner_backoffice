import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Category as CategoryIcon,
    CalendarMonth as CalendarMonthIcon,
    Info as InfoIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Person as PersonIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { Account } from '../../interfaces/account';
import { EnumCategoryAccount, EnumCategoryCod, EnumLicenceType, Licences, UserDto } from '../../types';
import { enumToArray, regexEmail } from '../../helpers';
import { useAccount } from '../../hooks';

interface CategoryLicenceFormProps {
    formValues: Account;
    licences: Licences[];
    setFormValues: React.Dispatch<React.SetStateAction<Account>>;
    handleInputChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
    handleCheckboxChange: ({ target }: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const CategoryLicenceForm: FC<CategoryLicenceFormProps> = ({
    formValues,
    licences,
    setFormValues,
    handleInputChange,
    handleCheckboxChange,
}) => {
    const { getUserByEmail } = useAccount();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorToEmailAssociation, setErrorToEmailAssociation] = useState<boolean>(false);

    const categoryOptions = enumToArray(EnumCategoryAccount);
    const licenceTypeOptions = Object.values(EnumLicenceType).map(x => x as string);
    const licencesOptions = licences
        .filter(l => l.licenceType.toLowerCase() === formValues.licenceType.toLowerCase())
        .map(x => ({ code: x.id, label: x.id, allowedUnit: x.maximumUnitAllowed }));

    const getCategoryColor = (code: string): 'success' | 'primary' | 'warning' => {
        switch (code) {
            case 'A':
                return 'success';
            case 'B':
                return 'primary';
            case 'C':
                return 'warning';
            default:
                return 'primary';
        }
    };

    const onChangeCategory = (_event: SyntheticEvent, value: { code: string; label: string } | null) => {
        if (value) {
            setFormValues(prevState => ({ ...prevState, category: value.code }));
        }
    };

    const onChangeLicenceType = (_event: SyntheticEvent, value: string | null) => {
        if (value) {
            setFormValues(prevState => ({ ...prevState, licenceType: value, licence: '', amountLicencesAllowed: 0 }));
        }
    };

    const onChangeLicence = (_event: SyntheticEvent, value: { code: string; label: string; allowedUnit: number } | null) => {
        if (value) {
            setFormValues(prevState => ({
                ...prevState,
                licence: value.code,
                amountLicencesAllowed: Number(value.allowedUnit),
            }));
        }
    };

    const onChangeUser = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;
        setFormValues(prevState => ({
            ...prevState,
            user: { ...prevState.user!, [name]: value } as UserDto,
        }));
    };

    const onBlurEmailToAssociate = async () => {
        const email = formValues.emailToAssociate.trim();
        if (email && regexEmail.test(email)) {
            const user = await getUserByEmail(email);
            if (user) setErrorToEmailAssociation(false);
            else setErrorToEmailAssociation(true);
        }
    };

    const isCategoryA = formValues.category === EnumCategoryCod.A;

    return (
        <Box>
            {/* Sección: Categoría */}
            <Card variant="outlined" sx={{ mb: 3, borderColor: 'primary.main', borderWidth: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Categoría de Cuenta
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Autocomplete
                                value={categoryOptions.find(opts => opts.code === formValues.category) || null}
                                onChange={onChangeCategory}
                                disabled={!!formValues.accountId}
                                options={categoryOptions}
                                getOptionLabel={(option) => option.label}
                                renderOption={(props, option) => (
                                    <Box
                                        component="li"
                                        {...props}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            py: 1.5,
                                        }}
                                    >
                                        <Chip
                                            label={option.code}
                                            size="small"
                                            color={getCategoryColor(option.code)}
                                            sx={{ fontWeight: 'bold', minWidth: 40, fontSize: '0.875rem' }}
                                        />
                                        <Typography variant="body2">{option.label}</Typography>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Categoría *"
                                        variant="outlined"
                                        helperText="Selecciona el tipo de cliente según su actividad"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: formValues.category && (
                                                <>
                                                    <Chip
                                                        label={formValues.category}
                                                        size="small"
                                                        color={getCategoryColor(formValues.category)}
                                                        sx={{ ml: 1, fontWeight: 'bold' }}
                                                    />
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                fullWidth
                            />
                        </Grid>

                        {/* Mensaje informativo según categoría */}
                        {formValues.category && (
                            <Grid item xs={12}>
                                <Alert
                                    severity={isCategoryA ? 'success' : 'info'}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {isCategoryA ? (
                                        <>
                                            <strong>Categoría A:</strong> Esta cuenta requiere configuración completa
                                            incluyendo datos de compañía y usuario administrador.
                                        </>
                                    ) : (
                                        <>
                                            <strong>Categoría {formValues.category}:</strong> Esta cuenta solo requiere
                                            configuración de licencia. Los datos de compañía son opcionales.
                                        </>
                                    )}
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Sección: Configuración de Licencia */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AssignmentTurnedInIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Configuración de Licencia
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Tipo de Licencia */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                value={formValues.licenceType || null}
                                onChange={onChangeLicenceType}
                                disabled={!!formValues.accountId}
                                options={licenceTypeOptions}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo de Licencia *"
                                        variant="outlined"
                                        helperText="Campo, Licencia o Hectárea"
                                        required
                                    />
                                )}
                                fullWidth
                            />
                        </Grid>

                        {/* Licencia */}
                        <Grid item xs={12} sm={6} md={5}>
                            <Autocomplete
                                value={licencesOptions.find(x => x.code === formValues.licence) || null}
                                onChange={onChangeLicence}
                                disabled={!!formValues.accountId || !formValues.licenceType}
                                options={licencesOptions}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Licencia *"
                                        variant="outlined"
                                        helperText="Selecciona primero el tipo de licencia"
                                        required
                                    />
                                )}
                                fullWidth
                            />
                        </Grid>

                        {/* Unidad Máxima */}
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Unidad Máxima"
                                name="maxUnits"
                                disabled
                                value={formValues.amountLicencesAllowed || 0}
                                helperText="Calculado automáticamente"
                                fullWidth
                            />
                        </Grid>

                        {/* Fechas de Licencia */}
                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarMonthIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        Período de Vigencia
                                    </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            type="date"
                                            label="Fecha de Inicio"
                                            name="startDateLicence"
                                            value={formValues.startDateLicence}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            type="date"
                                            label="Fecha de Fin"
                                            name="endDateLicence"
                                            value={formValues.endDateLicence}
                                            onChange={handleInputChange}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>

                        {/* Licencia Multipaís */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isLicenceMultipleCountry"
                                        checked={formValues.isLicenceMultipleCountry}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography>Licencia Multipaís</Typography>
                                        <Tooltip title="Permite usar la licencia en múltiples países">
                                            <InfoIcon fontSize="small" color="action" />
                                        </Tooltip>
                                    </Box>
                                }
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Sección: Usuario Admin (solo si es categoría A) */}
            {isCategoryA && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Usuario Administrador
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="associateUser"
                                        checked={formValues.associateUser}
                                        onChange={(e, c) => {
                                            handleCheckboxChange(e, c);
                                            if (!c) {
                                                setFormValues(prev => ({
                                                    ...prev,
                                                    emailToAssociate: '',
                                                }));
                                                setErrorToEmailAssociation(false);
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography fontWeight={500} variant="body1">
                                        Asociar a un usuario existente
                                    </Typography>
                                }
                            />

                            {formValues.associateUser ? (
                                // Email para asociar usuario existente
                                <Box sx={{ width: '100%', maxWidth: 500 }}>
                                    <TextField
                                        variant="outlined"
                                        type="email"
                                        label="Email del Usuario a Asociar"
                                        name="emailToAssociate"
                                        color={
                                            regexEmail.test(formValues.emailToAssociate) && errorToEmailAssociation
                                                ? 'error'
                                                : regexEmail.test(formValues.emailToAssociate) && !errorToEmailAssociation
                                                ? 'success'
                                                : undefined
                                        }
                                        value={formValues.emailToAssociate}
                                        focused={!!formValues.emailToAssociate}
                                        onBlur={onBlurEmailToAssociate}
                                        onChange={handleInputChange}
                                        helperText={
                                            errorToEmailAssociation
                                                ? 'Usuario no encontrado'
                                                : 'Ingresa el email de un usuario existente'
                                        }
                                        error={errorToEmailAssociation}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            ) : (
                                // Formulario de nuevo usuario admin
                                <Paper variant="outlined" elevation={0} sx={{ width: '100%', p: 3, bgcolor: 'grey.50' }}>
                                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                                        Crear Nuevo Usuario Administrador
                                    </Typography>
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                type="text"
                                                label="Nombre de Usuario *"
                                                name="username"
                                                value={formValues?.user?.username || ''}
                                                onChange={onChangeUser}
                                                placeholder="Nombre completo"
                                                required
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Email *"
                                                variant="outlined"
                                                type="email"
                                                name="email"
                                                value={formValues.user?.email || ''}
                                                onChange={onChangeUser}
                                                placeholder="usuario@ejemplo.com"
                                                required
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Contraseña *"
                                                variant="outlined"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formValues.user?.password || ''}
                                                onChange={onChangeUser}
                                                placeholder="Mínimo 8 caracteres"
                                                required
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Tooltip
                                                                title={
                                                                    <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
                                                                        <AlertTitle sx={{ fontSize: '0.8rem' }}>
                                                                            Requisitos de contraseña:
                                                                        </AlertTitle>
                                                                        • Mínimo 8 caracteres<br />
                                                                        • Una mayúscula<br />
                                                                        • Un número<br />
                                                                        • Un carácter especial
                                                                    </Alert>
                                                                }
                                                            >
                                                                <IconButton size="small">
                                                                    <InfoIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};
