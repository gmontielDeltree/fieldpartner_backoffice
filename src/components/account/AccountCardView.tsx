import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { Account } from '../../interfaces/account';
import { EnumStatusAccount } from '../../types';
import { setAccountActive } from '../../store/account';
import { useAppDispatch } from '../../hooks';
import { urlImg } from '../../config';

interface AccountCardViewProps {
  accounts: Account[];
  isLoading: boolean;
}

const getStatusColor = (status: string): { color: 'success' | 'error' | 'warning' | 'default', label: string } => {
  switch (status) {
    case EnumStatusAccount.Activa:
      return { color: 'success', label: 'Activa' };
    case EnumStatusAccount.Inactiva:
      return { color: 'error', label: 'Inactiva' };
    case EnumStatusAccount.Suspendida:
      return { color: 'warning', label: 'Suspendida' };
    case EnumStatusAccount.Cancelada:
      return { color: 'default', label: 'Cancelada' };
    default:
      return { color: 'default', label: status };
  }
};

export const AccountCardView: React.FC<AccountCardViewProps> = ({ accounts, isLoading }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickEditAccount = (account: Account): void => {
    dispatch(setAccountActive(account));
    navigate(`/accounts/${account.accountId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (accounts.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No se encontraron cuentas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Intenta ajustar los filtros de búsqueda
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {accounts.map((account) => {
        const statusInfo = getStatusColor(account.status);
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={account.accountId}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Logo y Estado */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Avatar
                    src={account.companyLogo ? `${urlImg}/${account.companyLogo}` : undefined}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.light',
                    }}
                  >
                    {!account.companyLogo && <BusinessIcon />}
                  </Avatar>
                  <Chip
                    label={statusInfo.label}
                    color={statusInfo.color}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Información principal */}
                <Typography variant="h6" gutterBottom noWrap title={account.denomination}>
                  {account.denomination}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {account.accountReference}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Métricas */}
                <Stack spacing={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PublicIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {account.country}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <DescriptionIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {account.licenceType} - {account.licence}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        {account.countCampos || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Campos
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        {account.countLicencias || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Licencias
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        {account.countHectareas || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hectáreas
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>

              {/* Acciones */}
              <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <Tooltip title="Editar cuenta">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onClickEditAccount(account)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
