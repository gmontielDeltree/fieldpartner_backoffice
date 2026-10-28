import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  BadgeOutlined,
  CheckCircleOutlineRounded,
  HighlightOffRounded,
  ReportProblemOutlined,
  LandscapeOutlined,
} from '@mui/icons-material';
import { AccountDto } from '../../interfaces/account';
import { EnumStatusAccount } from '../../types';
import { RollingNumber } from '../ui';

interface AccountStatsProps {
  accounts: AccountDto[];
}

type StatTone = 'accent' | 'green' | 'red' | 'orange' | 'blue';

/* Ficha del ícono: tinte tenue + color del tono (variables del theme). */
const TONE: Record<StatTone, { bg: string; fg: string }> = {
  accent: { bg: 'var(--accent-tint)', fg: 'var(--accent-ink)' },
  green: { bg: 'var(--green-tint)', fg: 'var(--green)' },
  red: { bg: 'var(--red-tint)', fg: 'var(--red)' },
  orange: { bg: 'var(--orange-tint)', fg: 'var(--orange)' },
  blue: { bg: 'var(--blue-tint)', fg: 'var(--blue)' },
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  tone: StatTone;
  index: number;
}

/** KPI chico: rótulo, número grande (odómetro) e ícono en ficha tenue. */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, tone, index }) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 1.5,
        px: 2,
        py: 1.75,
        borderRadius: '12px',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-card)',
        animation: 'fade-up 460ms var(--ease-out-strong) both',
        animationDelay: `${index * 40}ms`,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-3)', mb: 0.5, lineHeight: 1.3 }}>
          {title}
        </Typography>
        <Box
          component="div"
          sx={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.022em', lineHeight: 1.15, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}
        >
          <RollingNumber value={value} />
        </Box>
      </Box>
      <Box
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: TONE[tone].bg,
          color: TONE[tone].fg,
          '& svg': { fontSize: 19 },
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};

export const AccountStats: React.FC<AccountStatsProps> = ({ accounts }) => {

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
  // const totalFields = accounts.reduce((sum, acc) => sum + (acc.countCampos || 0), 0);
  const totalHectares = accounts.reduce((sum, acc) => sum + (acc.countHectareas || 0), 0);

  const stats: Omit<StatCardProps, 'index'>[] = [
    {
      title: 'Total cuentas',
      value: totalAccounts,
      icon: <BadgeOutlined />,
      tone: 'accent',
    },
    {
      title: 'Cuentas activas',
      value: activeAccounts,
      icon: <CheckCircleOutlineRounded />,
      tone: 'green',
    },
    {
      title: 'Cuentas inactivas',
      value: inactiveAccounts,
      icon: <HighlightOffRounded />,
      tone: 'red',
    },
    {
      title: 'Licencias por vencer',
      value: expiringLicenses,
      icon: <ReportProblemOutlined />,
      tone: 'orange',
    },
    {
      title: 'Total hectáreas',
      value: totalHectares.toLocaleString(),
      icon: <LandscapeOutlined />,
      tone: 'blue',
    },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={1.5}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={index}>
            <StatCard {...stat} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
