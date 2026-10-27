import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  AddRounded,
  DeleteOutline,
  DescriptionOutlined,
  EditOutlined,
  FileDownloadOutlined,
  GridOnOutlined,
  ListAltOutlined,
} from '@mui/icons-material';
import { useAppDispatch, useForm, useMenuModules } from '../../hooks';
import { setMenuModulesACtive } from '../../store/menumodules/menuModulesSlice';
import {
  DataTable,
  EmptyState,
  FilterChips,
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
import type { Tone } from '../../components';
import { ColumnProps, MenuModules } from '../../types';
import { IconCell, ListModulesPage } from './ListModulesPage';
import { exportMenuModules, ExportFormat } from '../../utils/excelExport';
import Swal from 'sweetalert2';

const columns: ColumnProps[] = [
  { text: 'Ícono', align: 'center' },
  { text: 'Módulo', align: 'left' },
  { text: 'Sistema', align: 'left', field: 'systemType', sortable: true },
  { text: 'ID', align: 'right', field: 'id', sortable: true },
  { text: 'Menú', align: 'left', field: 'menuOption', sortable: true },
  { text: 'Orden', align: 'right', field: 'order', sortable: true },
  { text: 'Tipo', align: 'left', field: 'menuType', sortable: true },
  { text: 'Ruta', align: 'left', field: 'route', sortable: true },
];

/** Tono de la ficha del tipo de menú (solo presentación). */
const MENU_TYPE_TONE: Record<string, Tone> = {
  SideBar: 'accent',
  NavBar: 'blue',
  Modal: 'orange',
};

const Dash = () => (
  <Box component='span' sx={{ color: 'var(--ink-3)' }}>
    -
  </Box>
);

type View = 'menus' | 'modules';

export const ListMenuModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, menuModules, getMenuModules, removeMenuModules } = useMenuModules();
  const { filterText, handleInputChange } = useForm({ filterText: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = (searchParams.get('view') === 'modules' ? 'modules' : 'menus') as
    | 'menus'
    | 'modules';
  const [view, setView] = useState<'menus' | 'modules'>(initialView);

  // Anchor para el menú de exportación
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const openExportMenu = (e: React.MouseEvent<HTMLElement>) => setExportAnchorEl(e.currentTarget);
  const closeExportMenu = () => setExportAnchorEl(null);

  const [sortField, setSortField] = React.useState<keyof MenuModules>('order');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field as keyof MenuModules);
      setSortDirection('asc');
    }
  };

  const compareValues = (
    a: MenuModules,
    b: MenuModules,
    field: keyof MenuModules,
  ) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === 'number' && typeof bv === 'number') return av - bv;
    return String(av ?? '').localeCompare(String(bv ?? ''), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  };

  const filterMenuModules = (menuModules: MenuModules[], filterText: string): MenuModules[] => {
    // Primero filtramos por el texto de búsqueda
    const filteredBySearch = menuModules.filter(menuModules =>
      matchesFilter(menuModules, filterText),
    );

    // Luego ordenamos segun el campo seleccionado (por defecto "order")
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === 'asc' ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por "order"
      if (result === 0 && sortField !== 'order') {
        return compareValues(a, b, 'order');
      }
      return result;
    });
  };

  const normalizeText = (text?: string | number) => {
    return String(text ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const matchesFilter = (menuModules: MenuModules, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      menuModules.systemType,
      menuModules.module?.moduleNameEs ?? '',
      menuModules.menuOption,
      String(menuModules.id),
    ];

    return searchableFields.some(field => normalizeText(String(field)).includes(normalizedFilter));
  };

  const onClickSearch = () => {
    if (filterText === '') {
      getMenuModules();
      return;
    }
  };

  const onClickUpdateMenuModules = (item: MenuModules) => {
    console.log('Item ID:', item._id);
    dispatch(setMenuModulesACtive(item));
    navigate(`/menus-modules/${item._id}`);
  };

  const handleDeleteMenuModules = (item: MenuModules) => {
    if (item._id && item._rev) {
      removeMenuModules(item._id, item._rev);
      getMenuModules();
    }
  };

  // Handler para exportar (respeta filtro de búsqueda)
  const handleExport = (format: ExportFormat) => {
    // Obtener datos filtrados si hay búsqueda activa
    const dataToExport = filterText
      ? filterMenuModules(menuModules, filterText)
      : menuModules;

    // Exportar
    exportMenuModules(dataToExport, format);

    // Cerrar menú
    closeExportMenu();

    // Mostrar confirmación
    const formatName = format === 'excel' ? 'Excel (.xlsx)' : 'CSV (.csv)';
    Swal.fire({
      icon: 'success',
      title: 'Exportación exitosa',
      text: `${dataToExport.length} registro${dataToExport.length !== 1 ? 's' : ''} exportado${dataToExport.length !== 1 ? 's' : ''} a ${formatName}`,
      timer: 2500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  useEffect(() => {
    getMenuModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = searchParams.get('view');
    if ((v === 'menus' || v === 'modules') && v !== view) setView(v);
  }, [searchParams, view]);

  const handleViewChange = (_: React.SyntheticEvent | null, next: 'menus' | 'modules' | null) => {
    if (!next) return;
    setView(next);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('view', next);
    setSearchParams(nextParams, { replace: true });
  };

  const rows = filterMenuModules(menuModules, filterText)

  // Selector de vista (Menús / Módulos) en la barra de la lista
  const viewSwitcher = (
    <FilterChips<View>
      options={[
        { key: 'menus', label: 'Menús' },
        { key: 'modules', label: 'Módulos' },
      ]}
      value={view}
      onChange={next => handleViewChange(null, next)}
      sx={{ mx: 0, px: 0.25, py: 0.25, borderRadius: '10px', background: 'var(--field)', boxShadow: 'var(--shadow-hairline)' }}
    />
  );

  return (
    <>
      {isLoading && <Loading loading />}
      {view === 'menus' ? (
        <PageContainer>
          <PageHeader
            icon={<ListAltOutlined />}
            title='Menús'
            meta={
              !isLoading ? (
                <ValuePill>
                  <RollingNumber value={rows.length} />
                </ValuePill>
              ) : undefined
            }
            actions={
              <>
                <Button
                  variant='outlined'
                  startIcon={<FileDownloadOutlined />}
                  onClick={openExportMenu}
                  aria-haspopup='menu'
                  aria-expanded={exportMenuOpen ? 'true' : undefined}
                >
                  Exportar
                </Button>
                <Menu
                  anchorEl={exportAnchorEl}
                  open={exportMenuOpen}
                  onClose={closeExportMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  sx={{ mt: 0.5 }}
                >
                  <MenuItem onClick={() => handleExport('excel')}>
                    <ListItemIcon>
                      <GridOnOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Excel (.xlsx)</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleExport('csv')}>
                    <ListItemIcon>
                      <DescriptionOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>CSV (.csv)</ListItemText>
                  </MenuItem>
                </Menu>
                <Button
                  variant='contained'
                  component={RouterLink}
                  to='/menus-modules/new'
                  startIcon={<AddRounded />}
                >
                  Nuevo
                </Button>
              </>
            }
          />
          <ListCard>
            <ListToolbar
              aside={filterText ? <FilteredCount shown={rows.length} total={menuModules.length} /> : undefined}
            >
              {viewSwitcher}
              <SearchField
                value={filterText}
                onChange={handleInputChange}
                placeholder='Buscar por menú, módulo, sistema o ID…'
                onSubmit={onClickSearch}
              />
            </ListToolbar>
            {!isLoading && rows.length === 0 ? (
              filterText ? (
                <EmptyState title='Sin resultados' hint='Probá con otra búsqueda' />
              ) : (
                <EmptyState
                  icon={<ListAltOutlined />}
                  title='No se encontraron menús'
                  hint='Cargá el primero con «Nuevo».'
                />
              )
            ) : (
              <DataTable
                key='datatable-menu-modules'
                columns={columns}
                isLoading={isLoading}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {rows.map(row => (
                  <ItemRow key={row._id} hover>
                    {/* Ícono */}
                    <TableCellStyled align='center' sx={{ width: 56, py: '6px' }}>
                      {row.icon && <IconCell iconName={row.icon} />}
                    </TableCellStyled>

                    {/* Módulo */}
                    <TableCellStyled align='left' sx={{ fontWeight: 500, minWidth: 120 }}>
                      {row.module?.moduleNameEs ?? '-'}
                    </TableCellStyled>

                    {/* Sistema */}
                    <TableCellStyled align='left' sx={{ whiteSpace: 'nowrap' }}>
                      {row.systemType ? (
                        <Box component='span' sx={{ color: 'var(--ink-2)' }}>
                          {row.systemType}
                        </Box>
                      ) : (
                        <Dash />
                      )}
                    </TableCellStyled>

                    {/* ID */}
                    <TableCellStyled align='right' sx={{ width: 72 }}>
                      <ValuePill mono>{row.id}</ValuePill>
                    </TableCellStyled>

                    {/* Menú */}
                    <TableCellStyled align='left' sx={{ minWidth: 150 }}>
                      <Box component='span' sx={{ display: 'block' }}>
                        {row.menuOption || '-'}
                      </Box>
                      {row.parentId != null && row.parentId !== ('' as unknown as number) && (
                        <Box component='span' sx={{ display: 'block', mt: 0.25, fontSize: 12, color: 'var(--ink-3)' }}>
                          ↳ submenú de {row.parentId}
                        </Box>
                      )}
                    </TableCellStyled>

                    {/* Orden */}
                    <TableCellStyled align='right' sx={{ width: 80 }}>
                      {row.order ? <ValuePill mono>{row.order}</ValuePill> : <Dash />}
                    </TableCellStyled>

                    {/* Tipo de menú */}
                    <TableCellStyled align='left' sx={{ width: 100 }}>
                      {row.menuType ? (
                        <ValuePill tone={MENU_TYPE_TONE[row.menuType] ?? 'neutral'}>{row.menuType}</ValuePill>
                      ) : (
                        <Dash />
                      )}
                    </TableCellStyled>

                    {/* Ruta */}
                    <TableCellStyled align='left' sx={{ minWidth: 200, maxWidth: 300 }}>
                      <Tooltip title={row.route || 'Sin ruta'}>
                        <Box
                          component='span'
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                            color: 'var(--ink-2)',
                          }}
                        >
                          {row.route || '-'}
                        </Box>
                      </Tooltip>
                    </TableCellStyled>

                    {/* Acciones */}
                    <TableCellStyled align='right' sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title='Editar menú'>
                        <IconButton aria-label='Editar' onClick={() => onClickUpdateMenuModules(row)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Eliminar menú'>
                        <IconButton aria-label='Eliminar' onClick={() => handleDeleteMenuModules(row)}>
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
      ) : (
        /* Lista de Módulos dentro de la misma vista */
        <ListModulesPage viewSwitcher={viewSwitcher} />
      )}
    </>
  );
};
