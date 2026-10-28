import React, { ChangeEvent, FC, SyntheticEvent, useState, useEffect } from 'react';
import {
    Autocomplete,
    Box,
    Chip,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import {
    BadgeOutlined,
    PublicOutlined,
} from '@mui/icons-material';
import { Account } from '../../interfaces/account';
import { Country, EnumStatusAccount } from '../../types';
import { FormCard, StaticField } from '../ui';

interface GeneralInfoFormProps {
    formValues: Account;
    countries: Country[];
    handleInputChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
    setFormValues: React.Dispatch<React.SetStateAction<Account>>;
}

export const GeneralInfoForm: FC<GeneralInfoFormProps> = ({
    formValues,
    countries,
    handleInputChange,
    setFormValues,
}) => {
    const [countrySelected, setCountrySelected] = useState<Country | null>(null);
    const countryOptions = countries.map(c => ({ code: c.code, label: c.descriptionES }));
    const statusOptions = Object.values(EnumStatusAccount).map(x => x as string);

    useEffect(() => {
        if (formValues.country) {
            const country = countries.find(c => c.code === formValues.country);
            if (country) setCountrySelected(country);
        }
    }, [formValues.country, countries]);

    const onChangeCountry = (_event: SyntheticEvent, value: { code: string; label: string } | null) => {
        const countryFound = countries.find(c => c.code === value?.code);
        if (countryFound) {
            setCountrySelected(countryFound);
            setFormValues(prevState => ({ ...prevState, country: countryFound.code }));
        }
    };

    const onChangeStatus = (_event: SyntheticEvent, value: string | null) => {
        if (value) {
            setFormValues(prevState => ({ ...prevState, status: value }));
        }
    };

    const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
        switch (status) {
            case EnumStatusAccount.Activa:
                return 'success';
            case EnumStatusAccount.Inactiva:
                return 'error';
            case EnumStatusAccount.Suspendida:
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <FormCard
            title="Información general"
            subtitle="Los campos marcados con asterisco (*) son obligatorios para continuar al siguiente paso."
            icon={<BadgeOutlined />}
        >
            <Grid container spacing={2}>
                {/* Cuenta ID */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        variant="outlined"
                        type="text"
                        label="Cuenta ID"
                        name="accountReference"
                        disabled={!!formValues.accountId}
                        value={formValues.accountReference}
                        onChange={handleInputChange}
                        placeholder="Ej: ACC-001"
                        helperText="Identificador único de la cuenta"
                        required
                        fullWidth
                    />
                </Grid>

                {/* Denominación */}
                <Grid item xs={12} sm={6} md={5}>
                    <TextField
                        variant="outlined"
                        type="text"
                        label="Denominación"
                        disabled={!!formValues.accountId}
                        name="denomination"
                        value={formValues.denomination}
                        onChange={handleInputChange}
                        placeholder="Nombre del cliente o empresa"
                        helperText="Nombre completo de la cuenta"
                        required
                        fullWidth
                    />
                </Grid>

                {/* Estado */}
                <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                        value={formValues.status}
                        onChange={onChangeStatus}
                        options={statusOptions}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                label="Estado"
                                variant="outlined"
                                helperText="Estado actual de la cuenta"
                                required
                            />
                        )}
                        fullWidth
                    />
                </Grid>

                {/* País */}
                <Grid item xs={12} sm={6} md={6}>
                    <Autocomplete
                        value={countryOptions.find(opts => opts.code === formValues.country) || null}
                        onChange={onChangeCountry}
                        disabled={!!formValues.accountId}
                        options={countryOptions}
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PublicOutlined fontSize="small" sx={{ color: 'var(--ink-3)' }} />
                                <Typography sx={{ fontSize: 13.5 }}>{option.label}</Typography>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="País"
                                variant="outlined"
                                helperText="País donde opera la cuenta"
                                required
                            />
                        )}
                        fullWidth
                    />
                </Grid>

                {/* Moneda (Solo lectura) */}
                <Grid item xs={12} sm={6} md={6}>
                    <StaticField label="Moneda">
                        {countrySelected?.currency || 'N/A'}
                    </StaticField>
                </Grid>
            </Grid>
        </FormCard>
    );
};
