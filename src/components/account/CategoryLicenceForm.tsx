import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    CircularProgress,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    AssignmentTurnedInOutlined,
    CategoryOutlined,
    CalendarMonthOutlined,
    InfoOutlined,
    VisibilityOutlined,
    VisibilityOffOutlined,
    PersonOutlineOutlined,
} from '@mui/icons-material';
import { FormCard, FormSectionTitle } from '../ui';
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
    onCheckingEmail: (checking: boolean) => void;
}

export const CategoryLicenceForm: FC<CategoryLicenceFormProps> = ({
    formValues,
    licences,
    setFormValues,
    handleInputChange,
    handleCheckboxChange,
    onCheckingEmail,
}) => {
    const { getUserByEmail, checkEmailInCognito } = useAccount();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorToEmailAssociation, setErrorToEmailAssociation] = useState<boolean>(false);
    const [errorEmailNewUser, setErrorEmailNewUser] = useState<boolean>(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
    const [allowedUsersCount, setAllowedUsersCount] = useState<number>(0);

    const categoryOptions = enumToArray(EnumCategoryAccount);
    const licenceTypeOptions = Object.values(EnumLicenceType).map(x => x as string);
    const licencesOptions = licences
        .filter(l => l.licenceType.toLowerCase() === formValues.licenceType.toLowerCase())
        .map(x => ({ code: x.id, label: x.id, allowedUnit: x.maximumUnitAllowed, allowedUsersCount: x.allowedUsersCount ?? 0 }));

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
            setAllowedUsersCount(0);
        }
    };

    const onChangeLicence = (_event: SyntheticEvent, value: { code: string; label: string; allowedUnit: number; allowedUsersCount: number } | null) => {
        if (value) {
            setFormValues(prevState => ({
                ...prevState,
                licence: value.code,
                amountLicencesAllowed: Number(value.allowedUnit),
            }));
            setAllowedUsersCount(value.allowedUsersCount);
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

    const onBlurEmailNewUser = async () => {
        const email = formValues.user?.email?.trim();
        if (email && regexEmail.test(email)) {
            setIsCheckingEmail(true);
            onCheckingEmail(true);
            const exists = await checkEmailInCognito(email);
            setErrorEmailNewUser(exists);
            setIsCheckingEmail(false);
            onCheckingEmail(false);
        } else {
            setErrorEmailNewUser(false);
        }
    };

    const isCategoryA = formValues.category === EnumCategoryCod.A;

    return (
        <Box>
            {/* Sección: Categoría */}
            <FormCard title="Categoría de cuenta" icon={<CategoryOutlined />}>
                <Grid container spacing={2}>
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
                                        py: 1,
                                    }}
                                >
                                    <Chip
                                        label={option.code}
                                        size="small"
                                        color={getCategoryColor(option.code)}
                                        sx={{ fontWeight: 600, minWidth: 32 }}
                                    />
                                    <Typography sx={{ fontSize: 13.5 }}>{option.label}</Typography>
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Categoría"
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
                                                    sx={{ ml: 0.5, fontWeight: 600 }}
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
                            <Alert severity={isCategoryA ? 'success' : 'info'}>
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
            </FormCard>

            {/* Sección: Configuración de Licencia */}
            <FormCard title="Configuración de licencia" icon={<AssignmentTurnedInOutlined />} delay={100}>
                <Grid container spacing={2}>
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
                                    label="Tipo de licencia"
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
                                    label="Licencia"
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
                            label="Unidad máxima"
                            name="maxUnits"
                            disabled
                            value={formValues.amountLicencesAllowed || 0}
                            helperText="Calculado automáticamente"
                            fullWidth
                        />
                    </Grid>

                    {/* Usuarios permitidos (informativo, proviene de la licencia) */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            variant="outlined"
                            type="text"
                            label="Usuarios permitidos"
                            disabled
                            value={allowedUsersCount || 0}
                            helperText="Según la licencia seleccionada"
                            fullWidth
                        />
                    </Grid>

                    {/* Número de Licencia */}
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            variant="outlined"
                            type="text"
                            label="Número de licencia"
                            name="licenceNumber"
                            value={formValues.licenceNumber}
                            onChange={handleInputChange}
                            disabled={!isCategoryA}
                            placeholder="Ej: LIC-2024-001"
                            helperText={
                                isCategoryA
                                    ? "Número identificador de la licencia"
                                    : "Solo disponible para categoría A"
                            }
                            fullWidth
                        />
                    </Grid>

                    {/* Licencia Multipaís */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControlLabel
                            sx={{ mt: 0.5 }}
                            control={
                                <Checkbox
                                    name="isLicenceMultipleCountry"
                                    checked={formValues.isLicenceMultipleCountry}
                                    onChange={handleCheckboxChange}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Typography sx={{ fontSize: 13.5 }}>Licencia multipaís</Typography>
                                    <Tooltip title="Permite usar la licencia en múltiples países">
                                        <InfoOutlined sx={{ fontSize: 16, color: 'var(--ink-3)' }} />
                                    </Tooltip>
                                </Box>
                            }
                        />
                    </Grid>

                    {/* Fechas de Licencia */}
                    <Grid item xs={12}>
                        <FormSectionTitle icon={<CalendarMonthOutlined />} sx={{ mt: 0.5, mb: 1.5 }}>
                            Período de vigencia
                        </FormSectionTitle>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    type="date"
                                    label="Fecha de inicio"
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
                                    label="Fecha de fin"
                                    name="endDateLicence"
                                    value={formValues.endDateLicence}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </FormCard>

            {/* Sección: Usuario Admin (solo si es categoría A) */}
            {isCategoryA && (
                <FormCard
                    title="Usuario administrador"
                    icon={<PersonOutlineOutlined />}
                    delay={140}
                    aside={
                        <FormControlLabel
                            sx={{ mr: 0 }}
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
                                <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>
                                    Asociar a un usuario existente
                                </Typography>
                            }
                        />
                    }
                >
                    {formValues.associateUser ? (
                        // Email para asociar usuario existente
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    variant="outlined"
                                    type="email"
                                    label="Email del usuario a asociar"
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
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        // Formulario de nuevo usuario admin
                        <>
                            <Typography sx={{ fontSize: 12.5, color: 'var(--ink-3)', mb: 1.5 }}>
                                Crear nuevo usuario administrador
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        variant="outlined"
                                        type="text"
                                        label="Nombre de usuario"
                                        name="username"
                                        value={formValues?.user?.username || ''}
                                        onChange={onChangeUser}
                                        placeholder="Nombre completo"
                                        required
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={formValues.user?.email || ''}
                                        onChange={(e) => {
                                            onChangeUser(e as React.ChangeEvent<HTMLInputElement>);
                                            setErrorEmailNewUser(false);
                                        }}
                                        onBlur={onBlurEmailNewUser}
                                        placeholder="usuario@ejemplo.com"
                                        required
                                        fullWidth
                                        error={errorEmailNewUser}
                                        color={
                                            regexEmail.test(formValues.user?.email || '') && !errorEmailNewUser
                                                ? 'success'
                                                : undefined
                                        }
                                        focused={!!formValues.user?.email}
                                        helperText={
                                            isCheckingEmail
                                                ? 'Verificando disponibilidad del email...'
                                                : errorEmailNewUser
                                                ? 'El email ya está registrado en el sistema'
                                                : 'Ingresa el email del nuevo administrador'
                                        }
                                        InputProps={{
                                            endAdornment: isCheckingEmail ? (
                                                <InputAdornment position="end">
                                                    <CircularProgress size={18} />
                                                </InputAdornment>
                                            ) : undefined,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Contraseña"
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
                                                        <IconButton size="small" aria-label="Requisitos de contraseña" sx={{ ml: -0.5 }}>
                                                            <InfoOutlined fontSize="small" />
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
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </FormCard>
            )}
        </Box>
    );
};
