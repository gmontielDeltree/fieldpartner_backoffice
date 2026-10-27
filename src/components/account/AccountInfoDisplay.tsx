import React from 'react';
import {
    Box,
    Chip,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import {
    BadgeOutlined,
    AssignmentTurnedInOutlined,
    TrendingUpRounded,
    PublicOutlined,
    MailOutline,
} from '@mui/icons-material';
import { AccountDto } from '../../interfaces/account';
import { FormCard, InfoItem, StatusPill } from '../ui';

interface AccountInfoDisplayProps {
    account: AccountDto;
}

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

const InfoRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <InfoItem label={label}>
        {value || 'N/A'}
    </InfoItem>
);

/** Valor con ícono chico adelante (email, país). */
const IconValue: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, '& > svg': { fontSize: 16, color: 'var(--ink-3)', flexShrink: 0 } }}>
        {icon}
        <Box component="span" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{children}</Box>
    </Box>
);

/** Métrica de la cuenta: número grande y rótulo, en ficha hundida. */
const MetricTile: React.FC<{ value: React.ReactNode; label: string }> = ({ value, label }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1,
            px: 1.5,
            py: 1.25,
            borderRadius: '8px',
            background: 'var(--inset)',
            boxShadow: 'var(--shadow-hairline)',
        }}
    >
        <Typography component="span" sx={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
            {label}
        </Typography>
        <Box component="span" sx={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
            {value}
        </Box>
    </Box>
);

export const AccountInfoDisplay: React.FC<AccountInfoDisplayProps> = ({ account }) => {
    return (
        <Box sx={{ mb: 1 }}>
            <Typography component="h2" sx={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-3)', mb: 1 }}>
                Información de la cuenta (solo lectura)
            </Typography>

            <Grid container spacing={2}>
                {/* Card 1: Datos Básicos */}
                <Grid item xs={12} md={6} lg={4}>
                    <FormCard title="Datos básicos" icon={<BadgeOutlined />} sx={{ height: '100%', mb: 0 }}>
                        <Stack spacing={1.5}>
                            <InfoRow label="Cuenta ID" value={account.accountReference} />
                            <InfoRow label="Denominación" value={account.denomination} />

                            <InfoItem label="Email">
                                <IconValue icon={<MailOutline />}>
                                    {account.email || 'N/A'}
                                </IconValue>
                            </InfoItem>

                            <InfoItem label="País">
                                <IconValue icon={<PublicOutlined />}>
                                    {account.country}
                                </IconValue>
                            </InfoItem>

                            <InfoItem label="Categoría">
                                <Chip
                                    label={`${account.category}`}
                                    color={getCategoryColor(account.category)}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </InfoItem>
                        </Stack>
                    </FormCard>
                </Grid>

                {/* Card 2: Información de Licencia */}
                <Grid item xs={12} md={6} lg={4}>
                    <FormCard title="Licencia" icon={<AssignmentTurnedInOutlined />} delay={100} sx={{ height: '100%', mb: 0 }}>
                        <Stack spacing={1.5}>
                            <InfoRow label="Tipo de licencia" value={account.licenceType} />
                            <InfoRow label="Licencia ID" value={account.licence} />
                            <InfoRow label="Unidades permitidas" value={account.amountLicencesAllowed} />

                            <InfoItem label="Multipaís">
                                <StatusPill status={account.isLicenceMultipleCountry ? 'done' : 'neutral'} size="sm">
                                    {account.isLicenceMultipleCountry ? 'Sí' : 'No'}
                                </StatusPill>
                            </InfoItem>
                        </Stack>
                    </FormCard>
                </Grid>

                {/* Card 3: Métricas Operativas */}
                <Grid item xs={12} md={6} lg={4}>
                    <FormCard title="Métricas" icon={<TrendingUpRounded />} delay={140} sx={{ height: '100%', mb: 0 }}>
                        <Stack spacing={1}>
                            <MetricTile value={account.countCampos || 0} label="Campos" />
                            <MetricTile value={account.countLicencias || 0} label="Licencias" />
                            <MetricTile value={account.countHectareas?.toLocaleString() || 0} label="Hectáreas" />
                        </Stack>
                    </FormCard>
                </Grid>
            </Grid>
        </Box>
    );
};
