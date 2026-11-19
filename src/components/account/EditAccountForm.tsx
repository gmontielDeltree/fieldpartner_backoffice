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
    InfoOutlined,
} from '@mui/icons-material';
import { EnumStatusAccount } from '../../types';
import { FormCard } from '../ui';

interface EditAccountFormProps {
    status: string;
    isLicenceMultipleCountry: boolean;
    onChangeStatus: (value: string | null) => void;
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
    isLicenceMultipleCountry,
    onChangeStatus,
    onChangeCheckbox,
}) => {
    const statusOptions = Object.values(EnumStatusAccount).map(x => x as string);

    return (
        <Box>
            <FormCard title="Datos editables" icon={<EditOutlined />} delay={180}>
                <Grid container spacing={2}>
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
                </Grid>
            </FormCard>

            <Alert severity="info">
                <strong>Nota:</strong> Solo podés editar el estado y la configuración multipaís. Para modificar fechas de licencia u otros datos, usá los endpoints de Licencias.
            </Alert>
        </Box>
    );
};
