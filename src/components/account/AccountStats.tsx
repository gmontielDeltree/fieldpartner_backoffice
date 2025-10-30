import React from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import {
  BusinessCenter as BusinessCenterIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Landscape as LandscapeIcon,
} from '@mui/icons-material';
import { Account } from '../../interfaces/account';
import { EnumStatusAccount } from '../../types';

interface AccountStatsProps {
  accounts: Account[];
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" color={color}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: bgColor,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const AccountStats: React.FC<AccountStatsProps> = ({ accounts }) => {
  const theme = useTheme();

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(acc => acc.status === EnumStatusAccount.Activa).length;
  const inactiveAccounts = accounts.filter(acc => acc.status === EnumStatusAccount.Inactiva).length;

  // Calcular licencias próximas a vencer (30 días)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const expiringLicenses = accounts.filter(acc => {
    const endDate = new Date(acc.endDateLicence);
    return endDate >= today && endDate <= thirtyDaysFromNow;
  }).length;

  // Calcular totales
  const totalFields = accounts.reduce((sum, acc) => sum + (acc.countCampos || 0), 0);
  const totalHectares = accounts.reduce((sum, acc) => sum + (acc.countHectareas || 0), 0);

  const stats = [
    {
      title: 'Total Cuentas',
      value: totalAccounts,
      icon: <BusinessCenterIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light + '20',
    },
    {
      title: 'Cuentas Activas',
      value: activeAccounts,
      icon: <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 28 }} />,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light + '20',
    },
    {
      title: 'Cuentas Inactivas',
      value: inactiveAccounts,
      icon: <CancelIcon sx={{ color: theme.palette.error.main, fontSize: 28 }} />,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light + '20',
    },
    {
      title: 'Licencias por Vencer',
      value: expiringLicenses,
      icon: <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light + '20',
    },
    {
      title: 'Total Hectáreas',
      value: totalHectares.toLocaleString(),
      icon: <LandscapeIcon sx={{ color: theme.palette.info.main, fontSize: 28 }} />,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light + '20',
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
