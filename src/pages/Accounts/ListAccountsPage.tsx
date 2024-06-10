import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import { DataTableCustomer, Loading } from '../../components';
import { Box, Typography, Grid, Button, TextField, InputAdornment, Container } from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  // PeopleAlt as PeopleAltIcon,
} from '@mui/icons-material';
import 'semantic-ui-css/semantic.min.css';
import { Icon } from "semantic-ui-react";
import { ColumnProps } from '../../types';
import { useCustomer, useForm } from '../../hooks';

const columns: ColumnProps[] = [
  { text: 'ID', align: 'left' },
  { text: 'Status', align: 'left' },
  { text: 'Pais', align: 'left' },
  { text: 'Denominacion', align: 'left' },
  { text: 'Tipo', align: 'left' },
  { text: 'Licencia', align: 'left' },
  { text: '#Campos', align: 'left' },
  { text: '#Contratos', align: 'left' },
  { text: '#Hectareas', align: 'left' },
  { text: '', align: 'center' }
];


export const ListAccountPage: React.FC = () => {

  const {
    isLoading,
    customers,
    getCustomers,
    setCustomers
  } = useCustomer();

  const {
    filterText,
    handleInputChange,
  } = useForm({ filterText: '' });

  const onClickSearch = (): void => {
    if (filterText === '') {
      getCustomers();
      return;
    }
    const filteredCustomers = customers.filter(
      ({ nombreCompleto, razonSocial }) =>
        (nombreCompleto && nombreCompleto.toLowerCase().includes(filterText.toLowerCase())) ||
        (razonSocial && razonSocial.toLowerCase().includes(filterText.toLowerCase()))
    );
    setCustomers(filteredCustomers);
  }


  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Container maxWidth="lg" sx={{ pl: 0, m: 0 }}>
      {
        isLoading && (<Loading loading={true} />)
      }
      <Box
        component="div"
        display="flex"
        alignItems="center"
        sx={{ ml: { sm: 2 }, pt: 2 }}>
        <Icon name="id card" size='huge' />
        <Typography variant='h5' sx={{ ml: { sm: 2 } }} >
          Cuentas
        </Typography>
      </Box>
      <Box component="div" sx={{ mt: 7 }}>
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2, mt: { sm: 2 } }}
        >
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/accounts/new"
              startIcon={<AddIcon />}
            >
              Nuevo
            </Button>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Grid container justifyContent="flex-end" >
              <Grid item xs={8} sm={4} >
                <TextField
                  variant="outlined"
                  type='text'
                  size='small'
                  placeholder='Nombre/Razon Social'
                  autoComplete='off'
                  name="filterText"
                  value={filterText}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start" />,
                  }}
                  fullWidth />
              </Grid>
              <Grid item xs={4} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  fullWidth
                  sx={{
                    height: '98%',
                    margin: 'auto',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                  }}
                  onClick={() => onClickSearch()}
                  startIcon={<SearchIcon />}>
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          component="div"
          sx={{ p: 1, mt: 2 }}>
          <DataTableCustomer
            key="datatable-customer"
            columns={columns}
            rows={customers}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Container>
  )
}
