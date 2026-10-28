import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { AddRounded, DeleteOutline, EditOutlined, ViewModuleOutlined } from '@mui/icons-material';
import { useForm, useModules } from '../../hooks';
import { useNavigate } from 'react-router-dom';

import {
  DataTable,
  DynamicIcon,
  EmptyState,
  FilteredCount,
  ItemRow,
  ListCard,
  ListToolbar,
  Loading,
  PageContainer,
  PageHeader,
  RollingNumber,
  SearchField,
  TableCellStyled,
  ValuePill,
} from '../../components';
import { ColumnProps, Modules } from '../../types';
import { ModuleFormDialog } from '../../components/Modules/ModuleFormDialog';
//import { setModulesActive } from '../../store/modules/modulesSlice';

const columns: ColumnProps[] = [
  { text: 'Ícono', align: 'center' },
  { text: 'Módulo (ES)', align: 'left' },
  { text: 'Módulo (EN)', align: 'left' },
  { text: 'Módulo (PT)', align: 'left' },
];

/** Ficha chica para el ícono que viene de la base (MUI o SVG guardado). */
export const IconCell: React.FC<{ iconName: string }> = ({ iconName }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: '8px',
      background: 'var(--inset)',
      boxShadow: 'var(--shadow-hairline)',
      color: 'var(--ink-2)',
      verticalAlign: 'middle',
      '& .MuiSvgIcon-root': { fontSize: 17 },
      '& > span': { width: 17, height: 17 },
    }}
  >
    <DynamicIcon iconName={iconName} />
  </Box>
);

interface ListModulesPageProps {
  /** selector Menús / Módulos que pone la página contenedora en la barra de la lista */
  viewSwitcher?: React.ReactNode;
}

export const ListModulesPage: React.FC<ListModulesPageProps> = ({ viewSwitcher }) => {
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

  const rows = filterModules(modules, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<ViewModuleOutlined />}
          title='Módulos'
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant='contained' onClick={handleOpenNew} startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar
            aside={filterText ? <FilteredCount shown={rows.length} total={modules.length} /> : undefined}
          >
            {viewSwitcher}
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder='Buscar por nombre del módulo…'
              onSubmit={onClickSearch}
            />
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title='Sin resultados' hint='Probá con otra búsqueda' />
            ) : (
              <EmptyState
                icon={<ViewModuleOutlined />}
                title='No se encontraron módulos'
                hint='Cargá el primero con «Nuevo».'
              />
            )
          ) : (
            <DataTable key='datatable-modules' columns={columns} isLoading={isLoading}>
              {rows.map(row => (
                <ItemRow key={row._id} hover>
                  {/* Ícono */}
                  <TableCellStyled align='center' sx={{ width: 56, py: '6px' }}>
                    {row.icon ? (
                      <IconCell iconName={row.icon} />
                    ) : (
                      <Box component='span' sx={{ color: 'var(--ink-3)' }}>
                        -
                      </Box>
                    )}
                  </TableCellStyled>

                  {/* Módulo ES */}
                  <TableCellStyled align='left' sx={{ fontWeight: 500, minWidth: 200 }}>
                    {row.moduleNameEs || '-'}
                  </TableCellStyled>

                  {/* Módulo EN */}
                  <TableCellStyled align='left' sx={{ minWidth: 200 }}>
                    <Box component='span' sx={{ color: 'var(--ink-2)' }}>
                      {row.moduleNameEn || '-'}
                    </Box>
                  </TableCellStyled>

                  {/* Módulo PT */}
                  <TableCellStyled align='left' sx={{ minWidth: 200 }}>
                    <Box component='span' sx={{ color: 'var(--ink-2)' }}>
                      {row.moduleNamePt || '-'}
                    </Box>
                  </TableCellStyled>

                  {/* Acciones */}
                  <TableCellStyled align='right' sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title='Editar módulo'>
                      <IconButton aria-label='Editar' onClick={() => handleOpenEdit(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Eliminar módulo'>
                      <IconButton aria-label='Eliminar' onClick={() => handleDeleteModules(row)}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCellStyled>
                </ItemRow>
              ))}
            </DataTable>
          )}
        </ListCard>
      </PageContainer>

      <ModuleFormDialog
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};
