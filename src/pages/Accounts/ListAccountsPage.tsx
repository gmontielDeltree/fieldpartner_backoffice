import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import {
  FilteredCount,
  ListCard,
  ListToolbar,
  Loading,
  PageContainer,
  PageHeader,
  RollingNumber,
  SearchField,
  ValuePill,
} from '../../components';
import { DataTable as DataTableAccount, AccountStats, AccountCardView } from '../../components/account';
import { Button, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import {
  AddRounded,
  BadgeOutlined,
  ViewListOutlined,
  ViewModuleOutlined,
} from '@mui/icons-material';
import { ColumnProps } from '../../types';
import { useAccount, useForm } from '../../hooks';

// Ojo: el texto de las columnas ordenables es la clave de columnToProperty en components/account/DataTable.
const columns: ColumnProps[] = [
  { text: 'Referencia ID', align: 'left' },
  { text: 'Estado', align: 'left' },
  { text: 'País', align: 'left' },
  { text: 'Denominación', align: 'left' },
  { text: 'Tipo', align: 'left' },
  { text: 'Licencia', align: 'left' },
  { text: '#Campos', align: 'right' },
  { text: '#Contratos', align: 'right' },
  { text: '#Hectáreas', align: 'right' },
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

  // La X del buscador manda el texto vacío: va al mismo handler que la X de antes.
  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      handleClearSearch();
      return;
    }
    handleInputChange(event);
  };

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
    <>
      {isLoading && <Loading loading={true} />}
      <PageContainer>
        <PageHeader
          icon={<BadgeOutlined />}
          title="Cuentas"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={accounts.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button
              variant="contained"
              component={RouterLink}
              to="/accounts/new"
              startIcon={<AddRounded />}
            >
              Nueva cuenta
            </Button>
          }
        />

        {/* Estadísticas */}
        <AccountStats accounts={allAccounts} />

        <ListCard>
          <ListToolbar
            aside={
              <>
                {filterText && <FilteredCount shown={accounts.length} total={allAccounts.length} />}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newView) => newView && setViewMode(newView)}
                  size="small"
                  aria-label="view mode"
                >
                  <ToggleButton value="table" aria-label="table view">
                    <Tooltip title="Vista de tabla">
                      <ViewListOutlined sx={{ fontSize: 18 }} />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="cards" aria-label="cards view">
                    <Tooltip title="Vista de tarjetas">
                      <ViewModuleOutlined sx={{ fontSize: 18 }} />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            }
          >
            <SearchField
              value={filterText}
              onChange={onChangeSearch}
              placeholder="Buscar por ID, denominación o país…"
            />
          </ListToolbar>

          {/* Vista de datos */}
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
        </ListCard>
      </PageContainer>
    </>
  );
};
