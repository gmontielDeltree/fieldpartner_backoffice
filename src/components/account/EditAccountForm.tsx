import React, { ChangeEvent } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Card,
    CardContent,
    Checkbox,
    Chip,
    FormControlLabel,
    Grid,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Edit as EditIcon,
    CalendarMonth as CalendarMonthIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { EnumStatusAccount } from '../../types';

interface EditAccountFormProps {
    status: string;
    startDateLicence: string;
    endDateLicence: string;
    isLicenceMultipleCountry: boolean;
    onChangeStatus: (value: string | null) => void;
    onChangeDate: (event: ChangeEvent<HTMLInputElement>) => void;
    onChangeCheckbox: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
        case EnumStatusAccount.Activa:
            return 'success';
        case EnumStatusAccount.Inactiva:
            return 'error';
        case EnumStatusAccount.Suspendida:
            return 'warning';
        case EnumStatusAccount.Cancelada:
            return 'default';
        default:
            return 'default';
    }
};

export const EditAccountForm: React.FC<EditAccountFormProps> = ({
    status,
    startDateLicence,
    endDateLicence,
    isLicenceMultipleCountry,
    onChangeStatus,
    onChangeDate,
    onChangeCheckbox,
}) => {
    const statusOptions = Object.values(EnumStatusAccount).map(x => x as string);

    // Calcular días restantes de la licencia
    const calculateDaysRemaining = () => {
        if (!endDateLicence) return null;
        const today = new Date();
        const endDate = new Date(endDateLicence);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = calculateDaysRemaining();
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0;
    const isExpired = daysRemaining !== null && daysRemaining < 0;

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <EditIcon sx={{ mr: 1, color: 'warning.main' }} />
                Datos Editables
            </Typography>

            <Card
                variant="outlined"
                sx={{
                    borderColor: 'warning.main',
                    borderWidth: 2,
                    bgcolor: 'warning.lighter',
                }}
            >
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Estado */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                value={status}
                                onChange={(_, value) => onChangeStatus(value)}
                                options={statusOptions}
                                renderOption={(props, option) => (
                                    <Box
                                        component="li"
                                        {...props}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}
                                    >
                                        <Chip
                                            label={option}
                                            size="small"
                                            color={getStatusColor(option)}
                                            sx={{ fontWeight: 500, minWidth: 80 }}
                                        />
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Estado de la Cuenta *"
                                        variant="outlined"
                                        helperText="Cambia el estado operativo de la cuenta"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: status && (
                                                <>
                                                    <Chip
                                                        label={status}
                                                        size="small"
                                                        color={getStatusColor(status)}
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

                        {/* Licencia Multipaís */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    pl: 2,
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isLicenceMultipleCountry"
                                            checked={isLicenceMultipleCountry}
                                            onChange={onChangeCheckbox}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography fontWeight={500}>Licencia Multipaís</Typography>
                                            <Tooltip title="Permite usar la licencia en múltiples países">
                                                <InfoIcon fontSize="small" color="action" />
                                            </Tooltip>
                                        </Box>
                                    }
                                />
                            </Box>
                        </Grid>

                        {/* Período de Vigencia */}
                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ bgcolor: 'white', p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CalendarMonthIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        Período de Vigencia de la Licencia
                                    </Typography>
                                </Box>

                                {/* Alertas de vencimiento */}
                                {isExpired && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        <strong>Licencia Vencida:</strong> Esta licencia expiró hace{' '}
                                        {Math.abs(daysRemaining!)} días.
                                    </Alert>
                                )}
                                {isExpiringSoon && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        <strong>Próximo a Vencer:</strong> Esta licencia vence en {daysRemaining} días.
                                    </Alert>
                                )}

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            type="date"
                                            label="Fecha de Inicio *"
                                            name="startDateLicence"
                                            value={startDateLicence}
                                            onChange={onChangeDate}
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Fecha en que comienza la vigencia"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            type="date"
                                            label="Fecha de Fin *"
                                            name="endDateLicence"
                                            value={endDateLicence}
                                            onChange={onChangeDate}
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Fecha en que expira la licencia"
                                            required
                                            fullWidth
                                            error={isExpired}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Información de duración */}
                                {startDateLicence && endDateLicence && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Duración:</strong>{' '}
                                            {Math.ceil(
                                                (new Date(endDateLicence).getTime() -
                                                    new Date(startDateLicence).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                            )}{' '}
                                            días
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Nota informativa */}
            <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Nota:</strong> Solo puedes editar el estado, las fechas de vigencia y la configuración
                multipaís. Para cambiar otros datos, contacta al administrador del sistema.
            </Alert>
        </Box>
    );
};
