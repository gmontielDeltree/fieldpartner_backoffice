import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import { Loading } from '../../components';
import { DataTable as DataTableAccount, AccountStats, AccountCardView } from '../../components/account';
import { Box, Typography, Grid, Button, TextField, InputAdornment, Container, IconButton, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  BusinessCenter as BusinessCenterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { ColumnProps } from '../../types';
import { useAccount, useForm } from '../../hooks';

const columns: ColumnProps[] = [
  { text: 'Referencia Id', align: 'left' },
  { text: 'Status', align: 'left' },
  { text: 'Pais', align: 'left' },
  { text: 'Denominacion', align: 'left' },
  { text: 'Tipo', align: 'left' },
  { text: 'Licencia', align: 'left' },
  { text: '#Campos', align: 'left' },
  { text: '#Contratos', align: 'left' },
  { text: '#Hectareas', align: 'left' },
  // { text: '', align: 'center' }
];


export const ListAccountPage: React.FC = () => {

  const {
    isLoading,
    accounts,
    getAccounts,
    setAccounts,
  } = useAccount();

  const {
    filterText,
    handleInputChange,
    reset,
  } = useForm({ filterText: '' });

  const [allAccounts, setAllAccounts] = useState(accounts);
  const [debouncedFilterText, setDebouncedFilterText] = useState(filterText);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Debounce effect para el filtro de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 300);

    return () => clearTimeout(timer);
  }, [filterText]);

  // Efecto para filtrar cuando cambia el texto debounced
  useEffect(() => {
    if (debouncedFilterText === '') {
      setAccounts(allAccounts);
      return;
    }
    const filteredCustomers = allAccounts.filter(
      ({ denomination, country, accountReference }) =>
        (denomination && denomination.toLowerCase().includes(debouncedFilterText.toLowerCase())) ||
        (country && country.toLowerCase().includes(debouncedFilterText.toLowerCase())) ||
        (accountReference && accountReference.toLowerCase().includes(debouncedFilterText.toLowerCase()))
    );
    setAccounts(filteredCustomers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterText, allAccounts]);

  const handleClearSearch = useCallback(() => {
    reset();
    setAccounts(allAccounts);
  }, [reset, allAccounts, setAccounts]);

  useEffect(() => {
    const loadAccounts = async () => {
      await getAccounts();
    };
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar allAccounts cuando se cargan las cuentas
  useEffect(() => {
    if (accounts.length > 0) {
      setAllAccounts(accounts);
    }
  }, [accounts]);


  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {isLoading && <Loading loading={true} />}

      {/* Header */}
      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <BusinessCenterIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="600">
          Cuentas
        </Typography>
      </Box>

      {/* Estadísticas */}
      <AccountStats accounts={allAccounts} />

      {/* Barra de acciones y búsqueda */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/accounts/new"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ height: 40 }}
            >
              Nueva Cuenta
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              variant="outlined"
              type="text"
              size="small"
              placeholder="Buscar por ID, Denominación o País..."
              autoComplete="off"
              name="filterText"
              value={filterText}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: filterText && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newView) => newView && setViewMode(newView)}
              size="small"
              aria-label="view mode"
            >
              <ToggleButton value="table" aria-label="table view">
                <Tooltip title="Vista de tabla">
                  <ViewListIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="cards" aria-label="cards view">
                <Tooltip title="Vista de tarjetas">
                  <ViewModuleIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Box>

      {/* Vista de datos */}
      <Box>
        {viewMode === 'table' ? (
          <DataTableAccount
            key="datatable-account"
            columns={columns}
            rows={accounts}
            isLoading={isLoading}
          />
        ) : (
          <AccountCardView
            key="cardview-account"
            accounts={accounts}
            isLoading={isLoading}
          />
        )}
      </Box>
    </Container>
  );
};
