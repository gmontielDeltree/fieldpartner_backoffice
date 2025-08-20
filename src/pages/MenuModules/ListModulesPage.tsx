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
  { text: 'Icono', align: 'left' },
  { text: 'Módulo (ES)', align: 'center' },
  { text: 'Módulo (EN)', align: 'center' },
  { text: 'Módulo (PT)', align: 'center' },
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
    const filteredBySearch = modules.filter(modules => matchesFilter(modules, filterText));
    return filteredBySearch;
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
      <Container maxWidth='md' sx={{ ml: 0 }}>
        <Box component='div' sx={{ mt: 7 }}>
          <Grid
            container
            spacing={0}
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{ p: 2, mt: { sm: 2 } }}
          >
            <Grid item xs={6} sm={2}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenNew}
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Nuevo
              </Button>
              <Box
                display='flex'
                alignItems='left'
                sx={{ ml: 2, mt: 2, position: 'relative' }}
              ></Box>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent='flex-end'>
                <Grid item xs={8} sm={5}>
                  <SearchInput
                    value={filterText}
                    placeholder='Modulo'
                    handleInputChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <SearchButton text='Buscar' onClick={() => onClickSearch()} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component='div' sx={{ p: 1 }}>
            <TableContainer
              key='table-modules'
              sx={{
                minHeight: '120px',
                maxHeight: '540px',
                overflow: 'scroll',
                mb: 5,
              }}
              component={Paper}
            >
              <DataTable key='datatable-modules' columns={columns} isLoading={isLoading}>
                {filterModules(modules, filterText).map(row => (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align='center'>
                      {row.icon && <DynamicIcon iconName={row.icon} />}
                    </TableCellStyled>
                    <TableCellStyled align='center'>{row.moduleNameEs}</TableCellStyled>
                    <TableCellStyled align='center'>{row.moduleNameEn}</TableCellStyled>
                    <TableCellStyled align='center'>{row.moduleNamePt}</TableCellStyled>
                    <TableCellStyled align='right'>
                      <Tooltip title='Editar'>
                        <IconButton aria-label='Editar' onClick={() => handleOpenEdit(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Eliminar'>
                        <IconButton
                          onClick={() => handleDeleteModules(row)}
                          style={{ fontSize: '1rem' }}
                          color='default'
                        >
                          <DeleteIcon name='trash alternate' />
                        </IconButton>
                      </Tooltip>
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
