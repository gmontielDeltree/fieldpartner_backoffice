import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography,
    Avatar,
} from '@mui/material';
import {
    Badge as BadgeIcon,
    Business as BusinessIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    TrendingUp as TrendingUpIcon,
    Public as PublicIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
} from '@mui/icons-material';
import { Account } from '../../interfaces/account';
import { EnumCategoryCod } from '../../types';
import { urlImg } from '../../config';

interface AccountInfoDisplayProps {
    account: Account;
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
    <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
            {value || 'N/A'}
        </Typography>
    </Box>
);

export const AccountInfoDisplay: React.FC<AccountInfoDisplayProps> = ({ account }) => {
    const isCategoryA = account.category === EnumCategoryCod.A;

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                Información de la Cuenta (Solo lectura)
            </Typography>

            <Grid container spacing={3}>
                {/* Card 1: Datos Básicos */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Datos Básicos</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow label="Cuenta ID" value={account.accountReference} />
                            <InfoRow label="Denominación" value={account.denomination} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    País
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PublicIcon fontSize="small" color="action" />
                                    <Typography variant="body1" fontWeight={500}>
                                        {account.country}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Categoría
                                </Typography>
                                <Chip
                                    label={`${account.category}`}
                                    color={getCategoryColor(account.category)}
                                    size="small"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 2: Información de Licencia */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AssignmentTurnedInIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Licencia</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow label="Tipo de Licencia" value={account.licenceType} />
                            <InfoRow label="Licencia ID" value={account.licence} />
                            <InfoRow label="Unidades Permitidas" value={account.amountLicencesAllowed} />

                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Multipaís
                                </Typography>
                                <Chip
                                    label={account.isLicenceMultipleCountry ? 'Sí' : 'No'}
                                    color={account.isLicenceMultipleCountry ? 'success' : 'default'}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 3: Datos de Compañía (solo si categoría A) */}
                {isCategoryA && (
                    <Grid item xs={12} md={6} lg={3}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6">Compañía</Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                {/* Logo */}
                                {account.companyLogo && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                        <Avatar
                                            src={`${urlImg}/${account.companyLogo}`}
                                            sx={{ width: 60, height: 60 }}
                                            variant="rounded"
                                        >
                                            <BusinessIcon />
                                        </Avatar>
                                    </Box>
                                )}

                                <InfoRow label="Razón Social" value={account.socialReason} />
                                <InfoRow label="Nombre Fantasía" value={account.fantasyName} />
                                <InfoRow label="Clave Tributaria" value={account.trybutaryCode} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                        Teléfono
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon fontSize="small" color="action" />
                                        <Typography variant="body1" fontWeight={500}>
                                            {account.phone || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {account.website && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            Website
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LanguageIcon fontSize="small" color="action" />
                                            <Typography variant="body2" fontWeight={500}>
                                                {account.website}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Card 4: Métricas Operativas */}
                <Grid item xs={12} md={6} lg={3}>
                    <Card variant="outlined" sx={{ height: '100%', bgcolor: 'primary.lighter' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6">Métricas</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Card variant="outlined" sx={{ bgcolor: 'white' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {account.countCampos || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Campos
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined" sx={{ bgcolor: 'white' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {account.countLicencias || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Licencias
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined" sx={{ bgcolor: 'white' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" color="primary" fontWeight="bold">
                                            {account.countHectareas?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Hectáreas
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
