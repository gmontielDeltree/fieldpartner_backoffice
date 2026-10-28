import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  EditOutlined,
  BusinessOutlined,
  DescriptionOutlined,
  PublicOutlined,
  BadgeOutlined,
} from '@mui/icons-material';
import { AccountDto } from '../../interfaces/account';
import { EnumStatusAccount } from '../../types';
import { setAccountActive } from '../../store/account';
import { useAppDispatch } from '../../hooks';
import { EmptyState, IconTile, StatusKind, StatusPill } from '../ui';

interface AccountCardViewProps {
  accounts: AccountDto[];
  isLoading: boolean;
}

// Estado de la cuenta → tono de la StatusPill
const getStatusColor = (status: string): { color: StatusKind, label: string } => {
  switch (status) {
    case EnumStatusAccount.Activa:
      return { color: 'done', label: 'Activa' };
    case EnumStatusAccount.Inactiva:
      return { color: 'error', label: 'Inactiva' };
    case EnumStatusAccount.Suspendida:
      return { color: 'todo', label: 'Suspendida' };
    case EnumStatusAccount.Cancelada:
      return { color: 'neutral', label: 'Cancelada' };
    default:
      return { color: 'neutral', label: status };
  }
};

/** Métrica chica de la tarjeta: número arriba, rótulo abajo. */
const Metric: React.FC<{ value: React.ReactNode; label: string }> = ({ value, label }) => (
  <Box sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
    <Box sx={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.3 }}>
      {value}
    </Box>
    <Typography component="div" sx={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
      {label}
    </Typography>
  </Box>
);

export const AccountCardView: React.FC<AccountCardViewProps> = ({ accounts, isLoading }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickEditAccount = (account: AccountDto): void => {
    dispatch(setAccountActive(account));
    navigate(`/accounts/${account.accountId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 13, color: 'var(--ink-3)' }}>Cargando…</Typography>
      </Box>
    );
  }

  if (accounts.length === 0) {
    return (
      <EmptyState
        icon={<BadgeOutlined />}
        title="No se encontraron cuentas"
        hint="Intenta ajustar los filtros de búsqueda"
      />
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1.5}>
        {accounts.map((account) => {
          const statusInfo = getStatusColor(account.status);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={account.accountId}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-hairline)',
                  transition: 'box-shadow 160ms ease',
                  '&:hover': { boxShadow: 'var(--shadow-card)' },
                }}
              >
                <Box sx={{ flexGrow: 1, p: 2 }}>
                  {/* Logo y Estado */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                    <IconTile size={36} tone="accent">
                      <BusinessOutlined />
                    </IconTile>
                    <StatusPill status={statusInfo.color} size="sm">
                      {statusInfo.label}
                    </StatusPill>
                  </Box>

                  {/* Información principal */}
                  <Typography
                    noWrap
                    title={account.denomination}
                    sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.012em', color: 'var(--ink)' }}
                  >
                    {account.denomination}
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>
                    {account.accountReference}
                  </Typography>

                  <Box sx={{ my: 1.5, borderTop: '1px solid var(--line)' }} />

                  {/* Métricas */}
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1} sx={{ color: 'var(--ink-3)', '& svg': { fontSize: 16 } }}>
                      <PublicOutlined />
                      <Typography sx={{ fontSize: 13, color: 'var(--ink-2)' }}>
                        {account.country}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} sx={{ color: 'var(--ink-3)', '& svg': { fontSize: 16 } }}>
                      <DescriptionOutlined />
                      <Typography sx={{ fontSize: 13, color: 'var(--ink-2)' }}>
                        {account.licenceType} - {account.licence}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      sx={{ mt: 0.5, py: 1, borderRadius: '8px', background: 'var(--inset)', boxShadow: 'var(--shadow-hairline)' }}
                    >
                      <Metric value={account.countCampos || 0} label="Campos" />
                      <Metric value={account.countLicencias || 0} label="Licencias" />
                      <Metric value={account.countHectareas || 0} label="Hectáreas" />
                    </Box>
                  </Stack>
                </Box>

                {/* Acciones */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, pb: 1.5 }}>
                  <Tooltip title="Editar cuenta">
                    <IconButton
                      aria-label="Editar"
                      onClick={() => onClickEditAccount(account)}
                      sx={{ color: 'var(--ink-3)', '&:hover': { color: 'var(--ink)' } }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
