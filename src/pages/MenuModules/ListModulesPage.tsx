import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  TableContainer,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, useModules } from '../../hooks';
import { useNavigate } from 'react-router-dom';

import {
  DataTable,
  DynamicIcon,
  ItemRow,
  Loading,
  SearchButton,
  SearchInput,
  TableCellStyled,
} from '../../components';
import { ColumnProps, Modules } from '../../types';
import { ModuleFormDialog } from '../../components/Modules/ModuleFormDialog';
//import { setModulesActive } from '../../store/modules/modulesSlice';

const columns: ColumnProps[] = [
  { text: 'Icono', align: 'center' },
  { text: 'Módulo (ES)', align: 'left' },
  { text: 'Módulo (EN)', align: 'left' },
  { text: 'Módulo (PT)', align: 'left' },
  { text: 'Acciones', align: 'center' },
];

export const ListModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, modules, getModules, removeModules, createModules, updateModules } =
    useModules();
  const { filterText, handleInputChange } = useForm({ filterText: '' });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Modules | null>(null);

  const handleOpenNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleOpenEdit = (item: Modules) => {
    setEditing(item);
    setOpen(true);
  };

  const handleSave = async (payload: Modules | Omit<Modules, '_id' | '_rev'>) => {
    if ('_id' in payload && payload._id) {
      await updateModules(payload as Modules);
    } else {
      await createModules(payload as Omit<Modules, '_id' | '_rev'>);
    }
    await getModules();
    setOpen(false);
    navigate('/menus-modules?view=modules', { replace: true });
  };

  const filterModules = (modules: Modules[], filterText: string): Modules[] => {
    const filteredBySearch = modules.filter(mod => matchesFilter(mod, filterText));

    // Orden numérico ascendente por campo `orden`. Si no es número, lo colocamos al final.
    return filteredBySearch.sort((a, b) => {
      const aVal = Number(a.orden);
      const bVal = Number(b.orden);
      const aNum = Number.isFinite(aVal) ? aVal : Infinity;
      const bNum = Number.isFinite(bVal) ? bVal : Infinity;
      return aNum - bNum;
    });
  };

  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const matchesFilter = (modules: Modules, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [modules.moduleNameEs, modules.moduleNameEn, modules.moduleNamePt];

    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };

  // const handleFilter = () => {
  //   setFilteredType(selectedType);
  // };

  const onClickSearch = () => {
    if (filterText === '') {
      getModules();
      return;
    }
  };

  //   const handleFilterButtonClick = () => {
  //     setShowOptions(!showOptions); // Invertir el estado de showOptions
  //   };

  //   const handleSelectChange = (value: string) => {
  //     console.log("Tipo seleccionado:", value);
  //     setSelectedType(value);
  //     setShowOptions(false); // Ocultar las opciones cuando se seleccione una
  //   };

  // const onClickUpdateModules = (item: Modules) => {
  //   console.log('Item ID:', item._id);
  //   dispatch(setModulesActive(item));
  //   navigate(`/modules/${item._id}`);
  // };

  const handleDeleteModules = (item: Modules) => {
    if (item._id && item._rev) {
      removeModules(item._id, item._rev);
      getModules();
      navigate('/menus-modules?view=modules', { replace: true });
    }
  };

  useEffect(() => {
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Loading loading />}
      <Container maxWidth='lg' sx={{ ml: 0 }}>
        <Box component='div' sx={{ mt: 5 }}>
          {/* Header mejorado */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Grid
              container
              spacing={2}
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Grid item xs={12} sm={3}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleOpenNew}
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  Nuevo Módulo
                </Button>
              </Grid>

              <Grid item xs={12} sm={9}>
                <Grid container spacing={1} justifyContent='flex-end'>
                  <Grid item xs={12} sm={7}>
                    <SearchInput
                      value={filterText}
                      placeholder='Buscar por nombre del módulo...'
                      handleInputChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SearchButton text='Buscar' onClick={() => onClickSearch()} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Stats rápidos */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Total de módulos: ${modules.length}`}
                color='primary'
                variant='outlined'
                size='small'
              />
            </Box>
          </Paper>

          {/* Tabla mejorada */}
          <Box component='div' sx={{ p: 1 }}>
            <TableContainer
              key='table-modules'
              sx={{
                minHeight: '120px',
                maxHeight: '650px',
                overflow: 'auto',
                mb: 5,
                boxShadow: 2,
                borderRadius: 1,
              }}
              component={Paper}
            >
              <DataTable key='datatable-modules' columns={columns} isLoading={isLoading}>
                {filterModules(modules, filterText).map(row => (
                  <ItemRow
                    key={row._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {/* Ícono */}
                    <TableCellStyled align='center' sx={{ width: '80px' }}>
                      {row.icon ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 0.5,
                          }}
                        >
                          <DynamicIcon iconName={row.icon} />
                        </Box>
                      ) : (
                        <Typography variant='caption' color='text.secondary'>
                          -
                        </Typography>
                      )}
                    </TableCellStyled>

                    {/* Módulo ES */}
                    <TableCellStyled align='left' sx={{ fontWeight: 500, minWidth: '200px' }}>
                      <Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
                        {row.moduleNameEs || '-'}
                      </Typography>
                    </TableCellStyled>

                    {/* Módulo EN */}
                    <TableCellStyled align='left' sx={{ minWidth: '200px' }}>
                      <Typography variant='body2' sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        {row.moduleNameEn || '-'}
                      </Typography>
                    </TableCellStyled>

                    {/* Módulo PT */}
                    <TableCellStyled align='left' sx={{ minWidth: '200px' }}>
                      <Typography variant='body2' sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                        {row.moduleNamePt || '-'}
                      </Typography>
                    </TableCellStyled>

                    {/* Acciones */}
                    <TableCellStyled align='center' sx={{ width: '120px' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title='Editar módulo' arrow>
                          <IconButton
                            aria-label='Editar'
                            onClick={() => handleOpenEdit(row)}
                            size='small'
                            color='primary'
                            sx={{
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                              },
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title='Eliminar módulo' arrow>
                          <IconButton
                            onClick={() => handleDeleteModules(row)}
                            size='small'
                            color='error'
                            sx={{
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'white',
                              },
                            }}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCellStyled>
                  </ItemRow>
                ))}
              </DataTable>
            </TableContainer>
          </Box>
        </Box>
      </Container>

      <ModuleFormDialog
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};
