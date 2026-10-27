import React, { ChangeEvent } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    FormControlLabel,
    Grid,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    EditOutlined,
    CalendarMonthOutlined,
    InfoOutlined,
} from '@mui/icons-material';
import { EnumStatusAccount } from '../../types';
import { FormCard, FormSectionTitle, StaticField } from '../ui';

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
            <FormCard title="Datos editables" icon={<EditOutlined />} delay={180}>
                <Grid container spacing={2}>
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
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}
                                >
                                    <Chip
                                        label={option}
                                        size="small"
                                        color={getStatusColor(option)}
                                        sx={{ minWidth: 80 }}
                                    />
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Estado de la cuenta"
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
                                                    sx={{ ml: 0.5 }}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isLicenceMultipleCountry"
                                        checked={isLicenceMultipleCountry}
                                        onChange={onChangeCheckbox}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>Licencia multipaís</Typography>
                                        <Tooltip title="Permite usar la licencia en múltiples países">
                                            <InfoOutlined sx={{ fontSize: 16, color: 'var(--ink-3)' }} />
                                        </Tooltip>
                                    </Box>
                                }
                            />
                        </Box>
                    </Grid>

                    {/* Período de Vigencia */}
                    <Grid item xs={12}>
                        <FormSectionTitle icon={<CalendarMonthOutlined />} sx={{ mt: 0.5, mb: 1.5 }}>
                            Período de vigencia de la licencia
                        </FormSectionTitle>

                        {/* Alertas de vencimiento */}
                        {isExpired && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                <strong>Licencia vencida:</strong> Esta licencia expiró hace{' '}
                                {Math.abs(daysRemaining!)} días.
                            </Alert>
                        )}
                        {isExpiringSoon && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <strong>Próximo a vencer:</strong> Esta licencia vence en {daysRemaining} días.
                            </Alert>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    type="date"
                                    label="Fecha de inicio"
                                    name="startDateLicence"
                                    value={startDateLicence}
                                    onChange={onChangeDate}
                                    InputLabelProps={{ shrink: true }}
                                    helperText="Fecha en que comienza la vigencia"
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    type="date"
                                    label="Fecha de fin"
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

                            {/* Información de duración */}
                            {startDateLicence && endDateLicence && (
                                <Grid item xs={12} sm={4}>
                                    <StaticField label="Duración">
                                        {Math.ceil(
                                            (new Date(endDateLicence).getTime() -
                                                new Date(startDateLicence).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        )}{' '}
                                        días
                                    </StaticField>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </FormCard>

            {/* Nota informativa */}
            <Alert severity="info">
                <strong>Nota:</strong> Solo puedes editar el estado, las fechas de vigencia y la configuración
                multipaís. Para cambiar otros datos, contacta al administrador del sistema.
            </Alert>
        </Box>
    );
};
